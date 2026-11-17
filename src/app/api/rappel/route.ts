import { callbackSchema } from "@/lib/callback";
import { site } from "@/config/site";
import { button, esc, limited, mail, shell, store, table, team } from "@/lib/server";

export const runtime = "nodejs";

/** Demande de rappel : on enregistre le contact et on prévient l'équipe, qui décroche son téléphone. */
export async function POST(req: Request) {
  if (limited(req)) return Response.json({ error: "Trop de demandes, réessayez dans quelques minutes" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    // pot de miel rempli : on fait comme si tout allait bien
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return Response.json({ ok: true });
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Formulaire incomplet" }, { status: 400 });
  }
  const d = parsed.data;
  if (d.startedAt && Date.now() - d.startedAt < 2500) return Response.json({ ok: true });

  const to = team();
  const tel = d.phone.replace(/[^0-9+]/g, "");
  const rows: [string, string][] = [
    ["Prestation", d.service],
    ["À rappeler", d.slot],
    ["Téléphone", d.phone],
    ["Page", d.page],
  ];

  const [stored, notified] = await Promise.all([
    store({
      works: [d.service],
      postal_code: null,
      timeline: `À rappeler : ${d.slot.toLowerCase()}`,
      name: d.name,
      phone: d.phone,
      source: d.source || "rappel",
      page: d.page || null,
      utm: {},
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? "",
    }),
    to.length
      ? mail({
          to,
          subject: `À rappeler : ${d.name} (${d.service})`,
          html: shell(
            `<p style="margin:0;color:#56616f;font-weight:600;font-size:14px">Demande de rappel</p>
            <h1 style="margin:6px 0 4px;font-size:26px;letter-spacing:-0.02em">${esc(d.name)}</h1>
            <p style="margin:0 0 20px;color:#56616f">${esc(d.service)}, ${esc(d.slot.toLowerCase())}</p>
            ${button(`tel:${tel}`, `Appeler le ${d.phone}`)}
            <div style="margin-top:24px">${table(rows)}</div>`,
            `Envoyé depuis le site ${esc(site.name)}`,
          ),
          text: [`Demande de rappel : ${d.name}`, ...rows.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`)].join("\n"),
        })
      : Promise.resolve("skipped" as const),
  ]);

  if (stored === "skipped" && notified === "skipped") {
    console.warn("[rappel] Aucun backend configuré (SUPABASE_* / RESEND_*). Demande non enregistrée :", d.name, d.phone);
    return Response.json({ error: "Le formulaire n'est pas encore branché" }, { status: 503 });
  }
  if (stored !== "ok" && notified !== "ok") return Response.json({ error: "Envoi impossible pour le moment" }, { status: 502 });
  return Response.json({ ok: true });
}
