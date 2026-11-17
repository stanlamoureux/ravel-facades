import { leadSchema, type Lead } from "@/lib/lead";
import { site } from "@/config/site";
import { button, esc, limited, mail, shell, store, table, team } from "@/lib/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (limited(req)) return Response.json({ error: "Trop de demandes, réessayez dans quelques minutes" }, { status: 429 });

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

  const [stored, emailed] = await Promise.all([
    store({
      works: lead.works,
      property: lead.property || null,
      postal_code: lead.postalCode,
      surface: lead.surface ?? null,
      timeline: lead.timeline || null,
      color: lead.color || null,
      accent: lead.accent || null,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      message: lead.message || null,
      source: lead.source || null,
      page: lead.page || null,
      utm: lead.utm,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? "",
    }),
    notify(lead),
  ]);

  if (stored === "skipped" && emailed === "skipped") {
    console.warn("[devis] Aucun backend configuré (SUPABASE_* / RESEND_*). Demande non enregistrée :", lead.name, lead.phone);
    return Response.json({ error: "Le formulaire n'est pas encore branché" }, { status: 503 });
  }
  if (stored !== "ok" && emailed !== "ok") return Response.json({ error: "Envoi impossible pour le moment" }, { status: 502 });
  return Response.json({ ok: true });
}

function notify(lead: Lead) {
  const to = team();
  if (!to.length) return Promise.resolve("skipped" as const);
  const rows: [string, string][] = [
    ["Travaux", lead.works.join(", ")],
    ["Bien", lead.property],
    ["Code postal", lead.postalCode],
    ["Surface", lead.surface ? `${lead.surface} m²` : ""],
    ["Délai", lead.timeline],
    ["Teinte", [lead.color, lead.accent && `menuiseries ${lead.accent}`].filter(Boolean).join(", ")],
    ["Email", lead.email],
    ["Message", lead.message],
    ["Origine", lead.source],
  ];
  const tel = lead.phone.replace(/[^\d+]/g, "");
  const html = shell(
    `<p style="margin:0;color:#56616f;font-weight:600;font-size:14px">Nouvelle demande de devis</p>
    <h1 style="margin:6px 0 4px;font-size:26px;letter-spacing:-0.02em">${esc(lead.name)}</h1>
    <p style="margin:0 0 20px;color:#56616f">${esc(lead.works.join(", "))}, ${esc(lead.postalCode)}</p>
    ${button(`tel:${tel}`, `Appeler le ${lead.phone}`)}
    <div style="margin-top:24px">${table(rows)}</div>`,
    `Envoyé depuis le site ${esc(site.name)}`,
  );
  const text = [`Nouvelle demande de devis : ${lead.name}`, `Téléphone : ${lead.phone}`, ...rows.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`)].join("\n");
  return mail({ to, replyTo: lead.email || undefined, subject: `Devis ${lead.works[0] ?? ""} - ${lead.name} (${lead.postalCode})`, html, text });
}
