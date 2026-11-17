import { site } from "@/config/site";

const steps = [
  { title: "Vous nous écrivez", body: `Par le formulaire ou par téléphone. On vous rappelle sous ${site.callbackDelay} pour caler une visite.` },
  { title: "Visite gratuite", body: "Un technicien mesure, sonde l'enduit et vous montre les teintes sur votre mur. Environ 45 minutes." },
  { title: "Devis détaillé", body: `Reçu sous ${site.quoteDelay}, poste par poste, avec la date de démarrage. Aucune relance insistante.` },
  { title: "Chantier et réception", body: "Planning tenu, chantier bâché et nettoyé chaque soir. Réception ensemble, garantie remise le jour même." },
];

export function Journey() {
  return (
    <section className="bg-pierre px-5 py-24 md:py-32" aria-labelledby="journey-title">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="journey-title" className="headline max-w-[760px] text-[clamp(2rem,4.4vw,3.6rem)]">
          De votre appel à la réception, sans mauvaise surprise.
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ardoise text-[0.95rem] font-[620] text-white tabular-nums">{i + 1}</span>
                {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-ardoise/15 md:block" aria-hidden />}
              </div>
              <h3 className="mt-5 text-[1.3rem] font-[620] tracking-[-0.015em]" style={{ fontStretch: "110%" }}>
                {s.title}
              </h3>
              <p className="mt-2 text-zinc">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
