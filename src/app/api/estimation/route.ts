import { conditions, heights, propertyTypes, simulatorWorks } from "@/config/offer";
import { estimate } from "@/config/pricing";
import { site } from "@/config/site";
import { estimateSchema } from "@/lib/lead";
import { button, esc, eur, limited, mail, shell, store, table, team } from "@/lib/server";

export const runtime = "nodejs";

/**
 * Estimation du simulateur : le prix est calculé ici, côté serveur, puis envoyé par email
 * au visiteur. Le navigateur ne le reçoit que si cet email n'a pas pu partir.
 */
export async function POST(req: Request) {
  if (limited(req)) return Response.json({ error: "Trop de demandes, réessayez dans quelques minutes" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return Response.json({ ok: true, emailed: true });
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Formulaire incomplet" }, { status: 400 });
  }
  const d = parsed.data;
  if (d.startedAt && Date.now() - d.startedAt < 2500) return Response.json({ ok: true, emailed: true });

  const work = simulatorWorks.find((x) => x.id === d.work);
  const property = propertyTypes.find((x) => x.id === d.property);
  const condition = conditions.find((x) => x.id === d.condition);
  const height = heights.find((x) => x.id === d.height);
  if (!work || !property || !condition || !height) return Response.json({ error: "Simulation invalide" }, { status: 400 });

  const est = estimate({ surface: d.surface, work: work.id, property: property.id, condition: condition.id, height: height.id });
  const range = `${eur(est.low)} à ${eur(est.high)}`;
  const recap: [string, string][] = [
    ["Travaux", work.label],
    ["Surface de façade", `${d.surface} m²`],
    ["Type de bien", property.label],
    ["État de la façade", condition.label],
    ["Hauteur", height.label],
    ["Code postal", d.postalCode],
  ];
  const tel = d.phone.replace(/[^\d+]/g, "");
  const first = d.name.split(" ")[0];

  const [stored, notified, sent] = await Promise.all([
    store({
      works: [work.label],
      property: property.label,
      postal_code: d.postalCode,
      surface: d.surface,
      estimate_low: est.low,
      estimate_high: est.high,
      name: d.name,
      phone: d.phone,
      email: d.email,
      message: `État : ${condition.label}. Hauteur : ${height.label}.`,
      source: "simulateur",
      page: d.page || null,
      utm: d.utm,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? "",
    }),
    team().length
      ? mail({
          to: team(),
          replyTo: d.email,
          subject: `Estimation ${work.label} - ${d.name} (${d.postalCode})`,
          html: shell(
            `<p style="margin:0;color:#56616f;font-weight:600;font-size:14px">Estimation demandée sur le simulateur</p>
            <h1 style="margin:6px 0 4px;font-size:26px;letter-spacing:-0.02em">${esc(d.name)}</h1>
            <p style="margin:0 0 20px;font-size:18px;font-weight:600">${esc(range)}</p>
            ${button(`tel:${tel}`, `Appeler le ${d.phone}`)}
            <div style="margin-top:24px">${table([...recap, ["Email", d.email], ["Téléphone", d.phone]])}</div>`,
            `Le visiteur a reçu ce montant par email. Envoyé depuis le site ${esc(site.name)}`,
          ),
          text: [`Estimation demandée : ${d.name}`, range, `Téléphone : ${d.phone}`, `Email : ${d.email}`, ...recap.map(([k, v]) => `${k} : ${v}`)].join("\n"),
        })
      : Promise.resolve("skipped" as const),
    mail({
      to: d.email,
      replyTo: team()[0],
      subject: `Votre estimation pour ${work.label.toLowerCase()} : ${range}`,
      html: shell(
        `<p style="margin:0;font-size:16px">Bonjour ${esc(first)},</p>
        <p style="margin:8px 0 0;color:#56616f;font-size:16px">Voici l'estimation de votre projet, calculée à partir de vos réponses.</p>
        <p style="margin:24px 0 2px;color:#56616f;font-size:14px;font-weight:600">${esc(work.label)}, ${d.surface} m² de façade</p>
        <p style="margin:0;font-size:34px;line-height:1.1;font-weight:700;letter-spacing:-0.03em">${esc(range)}</p>
        <p style="margin:6px 0 24px;color:#56616f;font-size:14px">TTC, échafaudage et protections compris.</p>
        ${table(recap)}
        <h2 style="margin:28px 0 6px;font-size:18px;letter-spacing:-0.01em">Et maintenant ?</h2>
        <p style="margin:0 0 20px;color:#56616f;font-size:16px">Un technicien vous rappelle sous ${esc(site.callbackDelay)} pour convenir d'une visite gratuite. C'est elle qui permet de fixer le prix ferme, poste par poste.</p>
        ${button(`tel:${site.phoneHref}`, `Nous appeler : ${site.phone}`)}`,
        `Estimation indicative, hors réparations de structure, à confirmer après visite. ${esc(site.legalName)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}.${site.demo ? " Ceci est un site de démonstration : l'entreprise et les prix sont fictifs." : ""}`,
      ),
      text: [
        `Bonjour ${first},`,
        "",
        `Votre estimation pour ${work.label.toLowerCase()}, ${d.surface} m² de façade : ${range} TTC, échafaudage et protections compris.`,
        "",
        ...recap.map(([k, v]) => `${k} : ${v}`),
        "",
        `Un technicien vous rappelle sous ${site.callbackDelay} pour convenir d'une visite gratuite. Vous pouvez aussi nous appeler au ${site.phone}.`,
        "",
        "Estimation indicative, hors réparations de structure, à confirmer après visite.",
      ].join("\n"),
    }),
  ]);

  if (stored === "skipped" && notified === "skipped" && sent === "skipped") {
    console.warn("[estimation] Aucun backend configuré (SUPABASE_* / RESEND_*).");
    return Response.json({ error: "Le simulateur n'est pas encore branché" }, { status: 503 });
  }
  if (stored !== "ok" && notified !== "ok" && sent !== "ok") return Response.json({ error: "Envoi impossible pour le moment" }, { status: 502 });
  // si l'email au visiteur n'est pas parti, on lui donne quand même sa réponse à l'écran
  return Response.json(sent === "ok" ? { ok: true, emailed: true } : { ok: true, emailed: false, estimate: est });
}
