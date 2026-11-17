import { site } from "@/config/site";
import { AnimatedNumber } from "./AnimatedNumber";
import { Shield } from "./icons";

export function Proof() {
  const [facades, , recommend] = site.stats;
  return (
    <section className="px-5 py-24 md:py-36" aria-labelledby="proof-title">
      <div className="mx-auto max-w-[1100px]">
        <h2 id="proof-title" className="display text-[clamp(2.2rem,5.4vw,4.6rem)]">
          Depuis {site.foundedYear},{" "}
          <AnimatedNumber value={facades.value} startOnView duration={1.6} className="tabular-nums" /> façades rénovées
          en Île-de-France.
        </h2>
        <div className="mt-14 grid gap-10 border-t border-ligne pt-10 md:grid-cols-3">
          <div>
            <p className="headline text-[2.6rem] tabular-nums">
              {recommend.value}
              {recommend.suffix}
            </p>
            <p className="mt-1 text-zinc">de nos clients nous recommandent à leurs proches.</p>
          </div>
          <div>
            <p className="headline text-[2.6rem] tabular-nums">{site.guaranteeYears} ans</p>
            <p className="mt-1 text-zinc">de garantie décennale sur chaque chantier, attestation remise avec le devis.</p>
          </div>
          <div>
            <p className="headline text-[2.6rem] tabular-nums">0 €</p>
            <p className="mt-1 text-zinc">pour la visite, le diagnostic et le devis. Vous décidez ensuite, sans relance.</p>
          </div>
        </div>
        <ul className="mt-12 flex flex-wrap gap-3" aria-label="Certifications">
          {site.certifications.map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-2xl bg-pierre px-4 py-3">
              <Shield className="h-6 w-6 text-outremer" />
              <span>
                <span className="block font-[620] leading-tight">{c.name}</span>
                <span className="block text-sm text-zinc">{c.detail}</span>
              </span>
            </li>
          ))}
          {site.demo && <li className="demo-tag self-center">Chiffres et labels d&apos;exemple, à remplacer</li>}
        </ul>
      </div>
    </section>
  );
}
