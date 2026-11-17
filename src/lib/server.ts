import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { site } from "@/config/site";

/** Outils communs aux routes /api/devis et /api/estimation. Serveur uniquement. */

export type Outcome = "ok" | "skipped" | "error";

/* Anti-spam léger : 5 envois par IP toutes les 10 minutes (par instance). */
const hits = new Map<string, number[]>();
export function limited(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const eur = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n).replace(/[  ]/g, " ")} €`;

export async function store(row: Record<string, unknown>): Promise<Outcome> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return "skipped";
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase.from(process.env.SUPABASE_LEADS_TABLE || "facade_leads").insert(row);
    if (error) {
      console.error("[leads] Supabase:", error.message);
      return "error";
    }
    return "ok";
  } catch (e) {
    console.error("[leads] Supabase exception:", e);
    return "error";
  }
}

export async function mail(m: { to: string | string[]; subject: string; html: string; text: string; replyTo?: string }): Promise<Outcome> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  try {
    const { error } = await new Resend(key).emails.send({ from: process.env.LEAD_FROM || `${site.name} <onboarding@resend.dev>`, ...m });
    if (error) {
      console.error("[leads] Resend:", error.message);
      return "error";
    }
    return "ok";
  } catch (e) {
    console.error("[leads] Resend exception:", e);
    return "error";
  }
}

/** Destinataires des notifications internes (variable LEAD_NOTIFY_TO, séparés par des virgules). */
export const team = () => (process.env.LEAD_NOTIFY_TO ?? "").split(",").map((x) => x.trim()).filter(Boolean);

const INK = "#0e1a26", GREY = "#56616f", LINE = "#e1e2e7";

export const table = (rows: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse;font-size:15px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:10px 0;border-top:1px solid ${LINE};color:${GREY};width:130px;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;border-top:1px solid ${LINE};color:${INK}">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

export const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:${INK};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:999px">${esc(label)}</a>`;

/** Habillage commun des emails : carte blanche sur fond gris, sobre, lisible partout. */
export const shell = (body: string, footer: string) =>
  `<!doctype html><html lang="fr"><body style="margin:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};line-height:1.5">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <p style="margin:0 0 16px 8px;font-size:20px;font-weight:700;letter-spacing:-0.03em;color:${INK}">${esc(site.name)}</p>
  <div style="background:#fff;border-radius:24px;padding:28px">${body}</div>
  <p style="text-align:center;color:#8b95a2;font-size:12px;line-height:1.5;margin:16px 12px 0">${footer}</p>
</div></body></html>`;
