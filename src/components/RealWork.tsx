"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuote } from "./QuoteContext";

/** Avant / après de vrais chantiers de Steevy GRAND. Les photos ne sont pas cadrées pareil : on les montre côte à côte. */
const cases = [
  {
    id: "orsay",
    tab: "Façade verdie",
    work: "Ravalement complet",
    text: "Murs verdis par l'humidité, enduit fatigué : façade lavée, reprise et repeinte, soubassement gris pour protéger le bas des murs.",
    before: { src: "/images/vrai-orsay-avant.webp", alt: "Pignon d'une maison avant travaux, enduit verdi et taché", position: "50% 55%" },
    after: { src: "/images/vrai-orsay-apres.webp", alt: "Le même pignon après ravalement, enduit blanc et soubassement gris", position: "50% 50%" },
    estimateAs: "ravalement",
  },
  {
    id: "maison",
    tab: "Maison jaunie",
    work: "Ravalement et peinture",
    text: "Une façade jaunie et marquée, reprise sous échafaudage, puis repeinte dans un beige clair et uniforme.",
    before: { src: "/images/vrai-maison-jaune-avant.webp", alt: "Maison à la façade jaunie, sous échafaudage avant travaux", position: "50% 45%" },
    after: { src: "/images/vrai-maison-jaune-apres.webp", alt: "La même maison après ravalement, façade beige clair", position: "50% 50%" },
    estimateAs: "ravalement",
  },
  {
    id: "fissure",
    tab: "Fissure",
    work: "Traitement de fissure",
    text: "Une fissure ouverte près de la porte : le mur est ouvert, repris au mortier, puis l'enduit est refait pour que la réparation disparaisse.",
    before: { src: "/images/vrai-fissure-avant.webp", alt: "Large fissure dans l'enduit à côté d'une porte rouge", position: "50% 50%" },
    after: { src: "/images/vrai-fissure-apres.webp", alt: "Le même mur après réparation, enduit refait sans trace", position: "50% 50%" },
    estimateAs: "ravalement",
  },
  {
    id: "angle",
    tab: "Angle fissuré",
    work: "Reprise d'angle",
    text: "Un angle de maison fendu sur toute la hauteur : reprise du support, des chaînes d'angle et de l'enduit.",
    before: { src: "/images/vrai-fissure-angle-avant.webp", alt: "Angle de maison fissuré sur toute la hauteur, gravats au sol", position: "50% 50%" },
    after: { src: "/images/vrai-fissure-angle-apres.webp", alt: "Le même angle après reprise, chaînes d'angle et enduit refaits", position: "50% 50%" },
    estimateAs: "ravalement",
  },
] as const;

export function RealWork() {
  const [active, setActive] = useState(0);
  const { goToEstimate } = useQuote();
  const c = cases[active];

  return (
    <section id="avant-apres" className="bg-encre py-14 text-white md:py-[min(7rem,11svh)]" aria-labelledby="ba-title">
      <div className="wrap">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="ba-title" className="t-h2 max-w-[16ch]">
              Avant, après. Nos vrais chantiers.
            </h2>
            <p className="t-lede mt-3 max-w-[44ch] !text-white/65 md:mt-4">Photos prises par Steevy sur ses chantiers, sans retouche.</p>
          </div>
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="Chantiers">
            <div className="flex w-max gap-1 rounded-full bg-white/10 p-1">
              {cases.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`h-10 whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-[600] transition-colors ${i === active ? "bg-white text-encre" : "text-white/75 hover:text-white"}`}
                >
                  {x.tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-10 md:gap-4" role="tabpanel">
          {(["before", "after"] as const).map((k) => (
            <figure key={`${c.id}-${k}`} className="relative h-[min(56svh,560px)] overflow-hidden rounded-[22px] bg-encre-2 md:rounded-[30px]">
              <Image src={c[k].src} alt={c[k].alt} fill quality={80} sizes="(min-width: 1200px) 570px, 50vw" className="object-cover" style={{ objectPosition: c[k].position }} />
              <figcaption className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.8125rem] font-[640] md:left-5 md:top-5 md:px-3.5 md:text-[0.875rem] ${k === "after" ? "bg-white text-encre" : "glass text-white"}`}>
                {k === "before" ? "Avant" : "Après"}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <p className="max-w-[60ch] text-[0.9375rem] leading-[1.55] text-white/75 md:text-base">
            <span className="font-[640] text-white">{c.work}.</span> {c.text}
          </p>
          <button type="button" className="btn btn-white w-full md:w-auto" onClick={() => goToEstimate(c.estimateAs)}>
            Faire une estimation
          </button>
        </div>
      </div>
    </section>
  );
}
