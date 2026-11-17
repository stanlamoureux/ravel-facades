import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { leadSchema, type Lead } from "@/lib/lead";
import { site } from "@/config/site";

export const runtime = "nodejs";

/* Anti-spam léger : 5 envois par IP toutes les 10 minutes (par instance). */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const eur = (n?: number) => (typeof n === "number" ? n.toLocaleString("fr-FR") + " €" : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ error: "Trop de demandes, réessayez dans quelques minutes" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // pot de miel rempli : on fait comme si tout allait bien
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return Response.json({ ok: true });
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Formulaire incomplet" }, { status: 400 });
  }
  const lead = parsed.data;
  if (lead.startedAt && Date.now() - lead.startedAt < 2500) return Response.json({ ok: true });

  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? "";
  const [stored, emailed] = await Promise.all([store(lead, userAgent), notify(lead)]);

  if (stored === "skipped" && emailed === "skipped") {
    console.warn("[devis] Aucun backend configuré (SUPABASE_* / RESEND_*). Demande non enregistrée :", lead.name, lead.phone);
    return Response.json({ error: "Le formulaire n'est pas encore branché" }, { status: 503 });
  }
  if (stored !== "ok" && emailed !== "ok") {
    return Response.json({ error: "Envoi impossible pour le moment" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

async function store(lead: Lead, userAgent: string): Promise<"ok" | "skipped" | "error"> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return "skipped";
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase.from(process.env.SUPABASE_LEADS_TABLE || "facade_leads").insert({
      works: lead.works,
      property: lead.property || null,
      postal_code: lead.postalCode,
      surface: lead.surface ?? null,
      timeline: lead.timeline || null,
      color: lead.color || null,
      accent: lead.accent || null,
      estimate_low: lead.estimateLow ?? null,
      estimate_high: lead.estimateHigh ?? null,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      message: lead.message || null,
      source: lead.source || null,
      page: lead.page || null,
      utm: lead.utm,
      user_agent: userAgent,
    });
    if (error) {
      console.error("[devis] Supabase:", error.message);
      return "error";
    }
    return "ok";
  } catch (e) {
    console.error("[devis] Supabase exception:", e);
    return "error";
  }
}

async function notify(lead: Lead): Promise<"ok" | "skipped" | "error"> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!key || !to) return "skipped";
  const from = process.env.LEAD_FROM || `${site.name} <onboarding@resend.dev>`;
  const rows: [string, string][] = [
    ["Travaux", lead.works.join(", ")],
    ["Bien", lead.property],
    ["Code postal", lead.postalCode],
    ["Surface", lead.surface ? `${lead.surface} m²` : ""],
    ["Délai", lead.timeline],
    ["Teinte", [lead.color, lead.accent && `menuiseries ${lead.accent}`].filter(Boolean).join(", ")],
    ["Estimation", lead.estimateLow ? `${eur(lead.estimateLow)} à ${eur(lead.estimateHigh)}` : ""],
    ["Email", lead.email],
    ["Message", lead.message],
    ["Origine", lead.source],
  ];
  const tel = lead.phone.replace(/[^\d+]/g, "");
  const html = `<!doctype html><html><body style="margin:0;background:#eef0f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1a1e24">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <div style="background:#fff;border-radius:20px;padding:28px">
    <p style="margin:0;color:#2a3ff5;font-weight:600;font-size:14px">Nouvelle demande de devis</p>
    <h1 style="margin:8px 0 4px;font-size:26px;letter-spacing:-0.02em">${esc(lead.name)}</h1>
    <p style="margin:0 0 20px;color:#646a73">${esc(lead.works.join(", "))}, ${esc(lead.postalCode)}</p>
    <a href="tel:${esc(tel)}" style="display:inline-block;background:#2a3ff5;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px">Appeler le ${esc(lead.phone)}</a>
    <table style="width:100%;margin-top:24px;border-collapse:collapse;font-size:15px">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:9px 0;border-top:1px solid #e3e6ea;color:#646a73;width:120px;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-top:1px solid #e3e6ea">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}
    </table>
  </div>
  <p style="text-align:center;color:#9aa0a8;font-size:12px;margin-top:16px">Envoyé depuis le site ${esc(site.name)}</p>
</div></body></html>`;
  const text = [`Nouvelle demande de devis : ${lead.name}`, `Téléphone : ${lead.phone}`, ...rows.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`)].join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((x) => x.trim()),
      replyTo: lead.email || undefined,
      subject: `Devis ${lead.works[0] ?? ""} - ${lead.name} (${lead.postalCode})`,
      html,
      text,
    });
    if (error) {
      console.error("[devis] Resend:", error.message);
      return "error";
    }
    return "ok";
  } catch (e) {
    console.error("[devis] Resend exception:", e);
    return "error";
  }
}
