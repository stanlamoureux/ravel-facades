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
      <div className="wrap grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-y-0">
        {/* sur téléphone : le titre, les photos, puis le détail. Sur ordinateur : le texte à gauche, les photos à droite */}
        <div className="lg:self-end">
          <h2 id="artisan-title" className="t-h2 max-w-[13ch]">
            Votre façadier dans le 41.
          </h2>
          <p className="t-lede mt-4 max-w-[40ch] md:mt-6">
            Installé à Soings-en-Sologne, le même artisan suit votre projet du premier appel à la réception. Vous savez toujours à qui parler.
          </p>
        </div>
        <div className="lg:col-start-1 lg:self-start">
          <dl className="border-t border-trait lg:mt-9">
            {points.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-trait py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6 md:py-4">
                <dt className="text-[1rem] font-[640] tracking-[-0.01em]">{k}</dt>
                <dd className="text-[0.9375rem] leading-[1.45] text-ardoise md:text-base">{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`tel:${site.phoneHref}`} className="btn btn-call mt-7 w-full tabular-nums sm:w-auto md:mt-9">
            <Phone className="h-5 w-5" />
            Appeler le {site.phone}
          </a>
        </div>

        {/* deux photos de chantier côte à côte, au format photo */}
        <figure className="row-start-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
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
