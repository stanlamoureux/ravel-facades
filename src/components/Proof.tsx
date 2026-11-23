import Image from "next/image";
import { site } from "@/config/site";
import { Phone } from "./icons";

const points = [
  ["Sur place", "Il vient voir votre façade et établit le devis lui-même"],
  ["Sur le chantier", "Il travaille avec son équipe, de l'échafaudage à la finition"],
  ["À la fin", "Il fait le tour avec vous avant de partir"],
] as const;

/** L'artisan, en vrai : Steevy GARAND et son équipe sur leurs chantiers. */
export function Proof() {
  return (
    <section id="steevy" className="py-14 md:py-[min(8rem,12svh)]" aria-labelledby="steevy-title">
      <div className="wrap grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
        <div>
          <h2 id="steevy-title" className="t-h2 max-w-[13ch]">
            Steevy GARAND, sur chaque chantier.
          </h2>
          <p className="t-lede mt-4 max-w-[40ch] md:mt-6">
            Façadier installé à Soings-en-Sologne, Steevy suit votre projet du premier appel à la réception. Vous savez toujours à qui parler.
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
            Appeler Steevy GARAND
          </a>
        </div>

        {/* trois photos de chantier : le pignon en entier, et deux plans à la taloche */}
        <figure className="-order-1 lg:order-none">
          <div className="grid grid-cols-2 gap-2.5 md:gap-3 lg:h-[min(70svh,560px)] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-2">
            <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-[24px] bg-gris sm:aspect-[4/3] md:rounded-[30px] lg:col-span-1 lg:row-span-2 lg:aspect-auto">
              <Image src="/images/vrai-chantier-pignon.webp" alt="Steevy GARAND et son équipe sur des échelles, en train de reprendre l'enduit d'un pignon" fill quality={80} sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" style={{ objectPosition: "50% 60%" }} />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-gris md:rounded-[26px] lg:aspect-auto">
              <Image src="/images/vrai-chantier-taloche.webp" alt="Enduit repris à la taloche sur un pignon" fill quality={78} sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" style={{ objectPosition: "45% 35%" }} />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-gris md:rounded-[26px] lg:aspect-auto">
              <Image src="/images/vrai-chantier-maison-ville.webp" alt="L'équipe en façade d'une maison de ville, échelles et protections en place" fill quality={78} sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" style={{ objectPosition: "50% 40%" }} />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-ardoise">{site.teamCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
