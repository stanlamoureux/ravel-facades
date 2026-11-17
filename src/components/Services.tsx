"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ficheHref } from "@/config/fiches";
import { services } from "@/config/offer";
import { typo } from "@/lib/typo";
import { useQuote } from "./QuoteContext";
import { Arrow, Chevron } from "./icons";

const photos: Record<string, { src: string; alt: string; position?: string }> = {
  ravalement: { src: "/images/service-ravalement.webp", alt: "Un façadier sur son échafaudage étale un enduit neuf à la taloche", position: "50% 30%" },
  nettoyage: { src: "/images/service-nettoyage.webp", alt: "Nettoyage d'un enduit à la lance, la partie lavée est nettement plus claire" },
  peinture: { src: "/images/service-peinture.webp", alt: "Un peintre passe au rouleau une première bande claire sur une façade ocre", position: "50% 35%" },
};

const thumbs: Record<string, { src: string; alt: string }> = {
  hydrofuge: { src: "/images/prestation-hydrofuge.webp", alt: "Gouttes d'eau qui perlent sur un enduit traité" },
  fissures: { src: "/images/prestation-fissures.webp", alt: "Rebouchage d'une fissure au couteau, sur une trame de renfort" },
  ite: { src: "/images/prestation-ite.webp", alt: "Panneaux d'isolant gris fixés sur un mur extérieur" },
};

/** Une ligne par prestation : ce que le client y gagne. */
const teaser: Record<string, string> = {
  ravalement: "Enduit repris, fissures traitées, finition neuve. Reparti pour vingt ans.",
  nettoyage: "Coulures, pollution et mousses retirées sans abîmer l'enduit.",
  peinture: "Deux couches dans la teinte de votre choix, essayée sur votre mur.",
  hydrofuge: "Un traitement invisible : l'eau perle, le mur respire.",
  fissures: "Ouvertes, pontées et rebouchées avant que l'eau ne s'y installe.",
  ite: "Isolant et enduit neuf en une seule opération.",
};

export function Services() {
  const { goToEstimate } = useQuote();
  const main = services.filter((s) => photos[s.id]);
  const more = services.filter((s) => !photos[s.id]);
  const row = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  // sur mobile les trois métiers défilent au doigt : on suit la carte affichée pour les points et les flèches
  const step = () => {
    const [a, b] = Array.from(row.current?.children ?? []) as HTMLElement[];
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  };
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const onScroll = () => {
      const s = step();
      if (s) setIndex(Math.max(0, Math.min(main.length - 1, Math.round(el.scrollLeft / s))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [main.length]);
  const go = (i: number) => row.current?.scrollTo({ left: i * step(), behavior: "smooth" });

  return (
    <section id="prestations" className="pb-20 md:pb-32" aria-labelledby="prestations-title">
      <div className="wrap">
        <h2 id="prestations-title" className="t-h2 max-w-[14ch]">
          Trois métiers, une seule équipe.
        </h2>
        <p className="t-lede mt-4 max-w-[44ch] md:mt-6">Nos compagnons sont salariés, pas sous-traitants. Vous gardez le même interlocuteur de la première visite à la réception du chantier.</p>
      </div>

      <ul ref={row} className="snap-row mt-9 gap-3 px-5 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-5 md:overflow-visible md:px-8">
        {main.map((s, i) => {
          const ph = photos[s.id];
          return (
            <li key={s.id} className="w-[72vw] max-w-[300px] md:w-auto md:max-w-none">
              <Link href={ficheHref(s.id)} className="group relative block aspect-[4/5.3] w-full overflow-hidden rounded-[28px] bg-gris text-white md:aspect-[4/5]" draggable={false}>
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  fill
                  quality={80}
                  sizes="(min-width: 768px) 380px, 72vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  style={{ objectPosition: ph.position }}
                  priority={i === 0}
                  draggable={false}
                />
                <span className="absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-[#07131d]/90 via-[#07131d]/50 to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-0 block p-5 md:p-6">
                  <span className="block text-[1.4375rem] font-[640] leading-[1.1] tracking-[-0.025em] md:text-[1.625rem]">{s.name}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-[1.4] text-white/85">{typo(teaser[s.id])}</span>
                  <span className="mt-4 flex items-center justify-between">
                    <span className="text-[0.9375rem] font-[600]">Voir la prestation</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-encre transition-transform duration-300 group-hover:translate-x-0.5">
                      <Arrow className="h-5 w-5" />
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li className="w-2 md:hidden" aria-hidden />
      </ul>

      <div className="wrap mt-4 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-1.5" aria-hidden>
          {main.map((s, i) => (
            <span key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-encre" : "w-1.5 bg-encre/20"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-gris transition-opacity disabled:opacity-35" aria-label="Prestation précédente" disabled={index === 0} onClick={() => go(index - 1)}>
            <Chevron className="h-5 w-5 rotate-180" />
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-encre text-white transition-opacity disabled:opacity-35" aria-label="Prestation suivante" disabled={index === main.length - 1} onClick={() => go(index + 1)}>
            <Chevron className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="wrap mt-12 md:mt-20">
        <h3 className="t-label text-ardoise">Et selon ce que révèle le diagnostic</h3>
        <ul className="mt-3 border-t border-trait">
          {more.map((s) => (
            <li key={s.id} className="border-b border-trait">
              <Link href={ficheHref(s.id)} className="group grid w-full grid-cols-[72px_1fr_auto] items-center gap-x-4 py-4 md:grid-cols-[88px_minmax(0,0.9fr)_minmax(0,1.5fr)_auto] md:gap-x-7 md:py-5">
                <span className="relative row-span-2 aspect-square overflow-hidden rounded-[16px] bg-gris md:row-span-1 md:rounded-[20px]">
                  <Image src={thumbs[s.id].src} alt={thumbs[s.id].alt} fill quality={80} sizes="88px" className="object-cover" />
                </span>
                <span className="self-end text-[1.0625rem] font-[620] leading-[1.2] tracking-[-0.015em] md:self-center md:text-[1.25rem]">{s.name}</span>
                <span className="col-start-2 self-start text-[0.9375rem] leading-[1.4] text-ardoise md:col-start-3 md:self-center md:text-base">{typo(teaser[s.id])}</span>
                <Chevron className="col-start-3 row-span-2 row-start-1 h-5 w-5 text-brume transition-transform duration-300 group-hover:translate-x-1 group-hover:text-encre md:col-start-4 md:row-span-1" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-ardoise md:mt-10">
          Envie d&apos;un ordre de prix avant d&apos;en parler&nbsp;?{" "}
          <button type="button" className="link font-[600]" onClick={() => goToEstimate()}>
            Faire une estimation
          </button>
        </p>
      </div>
    </section>
  );
}
