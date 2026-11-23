import Image from "next/image";
import { site } from "@/config/site";
import { Phone } from "./icons";

const points = [
  ["Sur place", "Le façadier vient voir votre façade et établit le devis lui-même"],
  ["Sur le chantier", "Il travaille avec son équipe, de l'échafaudage à la finition"],
  ["À la fin", "Il fait le tour avec vous avant de partir"],
] as const;

/** L'artisan, en vrai : l'équipe sur ses chantiers (sans nom, à la demande du client). */
export function Proof() {
  return (
    <section id="artisan" className="py-14 md:py-[min(8rem,12svh)]" aria-labelledby="artisan-title">
      <div className="wrap grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
        <div>
          <h2 id="artisan-title" className="t-h2 max-w-[13ch]">
            Votre façadier dans le 41.
          </h2>
          <p className="t-lede mt-4 max-w-[40ch] md:mt-6">
            Installé à Soings-en-Sologne, le même artisan suit votre projet du premier appel à la réception. Vous savez toujours à qui parler.
          </p>
          <dl className="mt-6 border-t border-trait md:mt-9">
            {points.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-trait py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6 md:py-4">
                <dt className="text-[1rem] font-[640] tracking-[-0.01em]">{k}</dt>
                <dd className="text-[0.9375rem] leading-[1.45] text-ardoise md:text-base">{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`tel:${site.phoneHref}`} className="btn btn-ink mt-7 tabular-nums md:mt-9">
            <Phone className="h-5 w-5" />
            Appeler, {site.phone}
          </a>
        </div>

        {/* deux photos de chantier côte à côte, au format photo */}
        <figure className="-order-1 lg:order-none">
          <div className="grid grid-cols-2 gap-2.5 md:gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-gris md:rounded-[26px]">
              <Image src="/images/vrai-chantier-taloche.webp" alt="Enduit repris à la taloche sur un pignon" fill quality={78} sizes="(min-width: 1024px) 320px, 50vw" className="object-cover" style={{ objectPosition: "45% 35%" }} />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-gris md:rounded-[26px]">
              <Image src="/images/vrai-chantier-maison-ville.webp" alt="L'équipe en façade d'une maison de ville, échelles et protections en place" fill quality={78} sizes="(min-width: 1024px) 320px, 50vw" className="object-cover" style={{ objectPosition: "50% 40%" }} />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-ardoise">{site.teamCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
