"use client";

import Image from "next/image";
import { services } from "@/config/offer";
import { useQuote } from "./QuoteContext";
import { Arrow, Chevron } from "./icons";

const photos: Record<string, { src: string; alt: string; position?: string }> = {
  ravalement: { src: "/images/service-ravalement.webp", alt: "Un façadier sur son échafaudage étale un enduit neuf à la taloche", position: "50% 30%" },
  nettoyage: { src: "/images/service-nettoyage.webp", alt: "Nettoyage d'un enduit à la lance\u00a0: la partie lavée est nettement plus claire" },
  peinture: { src: "/images/service-peinture.webp", alt: "Un peintre passe au rouleau une première bande claire sur une façade ocre", position: "50% 35%" },
};

const thumbs: Record<string, { src: string; alt: string }> = {
  hydrofuge: { src: "/images/prestation-hydrofuge.webp", alt: "Gouttes d'eau qui perlent sur un enduit traité" },
  fissures: { src: "/images/prestation-fissures.webp", alt: "Rebouchage d'une fissure au couteau, sur une trame de renfort" },
  ite: { src: "/images/prestation-ite.webp", alt: "Panneaux d'isolant gris fixés sur un mur extérieur" },
};

export function Services() {
  const { goToEstimate } = useQuote();
  const main = services.filter((s) => photos[s.id]);
  const more = services.filter((s) => !photos[s.id]);

  return (
    <section id="prestations" className="pb-20 md:pb-32" aria-labelledby="prestations-title">
      <div className="wrap">
        <h2 id="prestations-title" className="t-h2 max-w-[14ch]">
          Trois métiers, une seule équipe.
        </h2>
        <p className="t-lede mt-4 max-w-[44ch] md:mt-6">Nos compagnons sont salariés, pas sous-traitants. Vous gardez le même interlocuteur de la première visite à la réception du chantier.</p>
      </div>

      <ul className="snap-row mt-9 gap-3 px-5 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-5 md:overflow-visible md:px-8">
        {main.map((s, i) => {
          const ph = photos[s.id];
          return (
            <li key={s.id} className="w-[80vw] max-w-[340px] md:w-auto md:max-w-none">
              <button
                type="button"
                onClick={() => goToEstimate(s.estimateAs)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-gris text-left text-white"
                aria-label={`${s.name}, connaître le prix`}
              >
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  fill
                  quality={80}
                  sizes="(min-width: 768px) 380px, 80vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  style={{ objectPosition: ph.position }}
                  priority={i === 0}
                />
                <span className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#07131d]/90 via-[#07131d]/45 to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-0 block p-5 md:p-6">
                  <span className="block text-[1.5rem] font-[640] leading-[1.1] tracking-[-0.025em] md:text-[1.625rem]">{s.name}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-[1.4] text-white/85">{teaser[s.id]}</span>
                  <span className="mt-4 flex items-center justify-between">
                    <span className="text-[0.9375rem] font-[600]">Connaître le prix</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-encre transition-transform duration-300 group-hover:translate-x-0.5">
                      <Arrow className="h-5 w-5" />
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        <li className="w-2 md:hidden" aria-hidden />
      </ul>

      <div className="wrap mt-12 md:mt-20">
        <h3 className="t-label text-ardoise">Et selon ce que révèle le diagnostic</h3>
        <ul className="mt-3 border-t border-trait">
          {more.map((s) => (
            <li key={s.id} className="border-b border-trait">
              <button type="button" onClick={() => goToEstimate(s.estimateAs)} className="group grid w-full grid-cols-[72px_1fr_auto] items-center gap-x-4 py-4 text-left md:grid-cols-[88px_minmax(0,0.9fr)_minmax(0,1.5fr)_auto_auto] md:gap-x-7 md:py-5">
                <span className="relative row-span-2 aspect-square overflow-hidden rounded-[16px] bg-gris md:row-span-1 md:rounded-[20px]">
                  <Image src={thumbs[s.id].src} alt={thumbs[s.id].alt} fill quality={80} sizes="88px" className="object-cover" />
                </span>
                <span className="self-end text-[1.0625rem] font-[620] leading-[1.2] tracking-[-0.015em] md:self-center md:text-[1.25rem]">{s.name}</span>
                <span className="col-start-2 self-start text-[0.9375rem] leading-[1.4] text-ardoise md:col-start-3 md:self-center md:text-base">{teaser[s.id]}</span>
                <span className="hidden text-[0.9375rem] font-[600] md:col-start-4 md:block">Connaître le prix</span>
                <Chevron className="col-start-3 row-span-2 row-start-1 h-5 w-5 text-brume transition-transform duration-300 group-hover:translate-x-1 group-hover:text-encre md:col-start-5 md:row-span-1" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Une ligne par prestation : ce que le client y gagne. */
const teaser: Record<string, string> = {
  ravalement: "Enduit repris, fissures traitées, finition neuve. Reparti pour vingt ans.",
  nettoyage: "Coulures, pollution et mousses retirées sans abîmer l'enduit.",
  peinture: "Deux couches dans la teinte de votre choix, essayée sur votre mur.",
  hydrofuge: "Un traitement invisible : l'eau perle, le mur respire.",
  fissures: "Ouvertes, pontées et rebouchées avant que l'eau ne s'y installe.",
  ite: "Isolant et enduit neuf en une seule opération.",
};
