"use client";

import Image from "next/image";
import { animate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Grip } from "./icons";

/** Chantiers du comparateur - DONNÉES TEST, à remplacer par de vrais chantiers du client. */
const cases = [
  {
    id: "pavillon",
    tab: "Pavillon",
    before: { src: "/images/pavillon-avant.webp", alt: "Pavillon avant travaux : coulures noires, mousses et fissures" },
    after: { src: "/images/pavillon-apres.webp", alt: "Le même pavillon après ravalement : enduit clair et uniforme" },
    position: "50% 50%",
    facts: [
      ["Lieu", "Palaiseau, Essonne"],
      ["Travaux", "Ravalement complet"],
      ["Surface", "148 m² de façade"],
      ["Durée", "3 semaines"],
    ],
    estimateAs: "ravalement",
  },
  {
    id: "immeuble",
    tab: "Immeuble",
    before: { src: "/images/immeuble-avant.webp", alt: "Petit immeuble avant travaux : enduit gris marqué de longues coulures sous chaque appui" },
    after: { src: "/images/immeuble-apres.webp", alt: "Le même immeuble après ravalement : façade blanc cassé, encadrements nets" },
    position: "50% 22%",
    facts: [
      ["Lieu", "Antony, Hauts-de-Seine"],
      ["Travaux", "Ravalement et peinture"],
      ["Surface", "620 m² de façade"],
      ["Durée", "7 semaines"],
    ],
    estimateAs: "ravalement",
  },
  {
    id: "bourg",
    tab: "Maison de bourg",
    before: { src: "/images/bourg-avant.webp", alt: "Maison de bourg avant nettoyage : enduit couvert de mousse verte" },
    after: { src: "/images/bourg-apres.webp", alt: "La même maison après nettoyage : enduit beige clair, pierres d'angle apparentes" },
    position: "50% 60%",
    facts: [
      ["Lieu", "Étampes, Essonne"],
      ["Travaux", "Nettoyage et hydrofuge"],
      ["Surface", "190 m² de façade"],
      ["Durée", "4 jours"],
    ],
    estimateAs: "nettoyage-hydrofuge",
  },
] as const;

/**
 * La photo est recadrée dans un cadre plus haut qu'elle : elle s'affiche donc plus large que l'écran.
 * On le dit au navigateur, sinon il charge une version trop petite et l'image paraît floue.
 */
const SIZES = "(min-width: 1200px) 1136px, (min-width: 768px) 100vw, 180vw";

export function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const [hint, setHint] = useState(true); // "Glissez pour comparer", jusqu'au premier geste
  const dragging = useRef(false);
  const touched = useRef(false);
  const { goToEstimate } = useQuote();
  const c = cases[active];

  // à l'arrivée dans l'écran, la poignée oscille une fois pour montrer qu'elle se déplace
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (touched.current) return;
        controls = animate(50, [50, 68, 50], { duration: 1.5, ease: "easeInOut", delay: 0.25, onUpdate: (v) => !touched.current && setPos(v) });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
    };
  }, []);

  const fromPointer = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section id="avant-apres" className="bg-encre py-20 text-white md:py-32" aria-labelledby="ba-title">
      <div className="wrap md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <h2 id="ba-title" className="t-h2 max-w-[13ch]">
            Même façade, quelques semaines plus tard.
          </h2>
          <p className="t-lede mt-4 max-w-[40ch] !text-white/65 md:mt-6">Trois chantiers, photographiés du même endroit avant et après notre passage.</p>
        </div>
        <div className="mt-8 md:mt-0 md:w-[420px] md:shrink-0">
          <p id="ba-pick" className="text-[0.9375rem] font-[600] text-white/90">
            Choisissez un chantier <span className="font-[480] text-white/50">({active + 1} sur {cases.length})</span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5 md:gap-3" role="tablist" aria-labelledby="ba-pick">
            {cases.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setActive(i);
                    setPos(50);
                  }}
                  className="group text-left"
                >
                  {/* la vignette montre déjà le principe : moitié avant, moitié après */}
                  <span className={`relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-encre-2 transition-[box-shadow,opacity] duration-200 md:rounded-[16px] ${on ? "shadow-[0_0_0_2.5px_#fff]" : "opacity-60 group-hover:opacity-90"}`}>
                    <Image src={x.after.src} alt="" fill quality={75} sizes="(min-width: 768px) 140px, 31vw" className="object-cover" style={{ objectPosition: x.position }} draggable={false} />
                    <span className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
                      <Image src={x.before.src} alt="" fill quality={75} sizes="(min-width: 768px) 140px, 31vw" className="object-cover" style={{ objectPosition: x.position }} draggable={false} />
                    </span>
                    <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
                  </span>
                  <span className={`mt-2 block text-[0.8125rem] font-[600] leading-[1.2] transition-colors md:text-[0.9375rem] ${on ? "text-white" : "text-white/60 group-hover:text-white/85"}`}>{x.tab}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 max-w-[1200px] md:mt-12 md:px-8">
        <div
          ref={box}
          role="tabpanel"
          className="relative aspect-square touch-pan-y select-none overflow-hidden bg-encre-2 md:aspect-[16/9] md:rounded-[32px]"
          style={{ ["--x" as string]: `${pos}%` }}
          onPointerDown={(e) => {
            touched.current = true;
            setHint(false);
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e.clientX);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <Image key={c.after.src} src={c.after.src} alt={c.after.alt} fill quality={85} sizes={SIZES} className="pointer-events-none object-cover" style={{ objectPosition: c.position }} draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--x)) 0 0)" }}>
            <Image key={c.before.src} src={c.before.src} alt={c.before.alt} fill quality={85} sizes={SIZES} className="pointer-events-none object-cover" style={{ objectPosition: c.position }} draggable={false} />
          </div>

          <span className="glass pointer-events-none absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-[600] transition-opacity duration-200 md:left-6 md:top-6" style={{ opacity: pos < 14 ? 0 : 1 }}>
            Avant
          </span>
          <span className="glass pointer-events-none absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-[600] transition-opacity duration-200 md:right-6 md:top-6" style={{ opacity: pos > 86 ? 0 : 1 }}>
            Après
          </span>

          <span className={`glass pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8125rem] font-[600] transition-opacity duration-300 md:bottom-6 ${hint ? "opacity-100" : "opacity-0"}`} aria-hidden>
            Glissez pour comparer
          </span>

          <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white" style={{ left: "var(--x)" }} aria-hidden>
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-encre shadow-[0_4px_20px_rgb(0_0_0/0.35)]">
              <Grip className="h-5 w-5" />
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(pos)}
            onChange={(e) => {
              touched.current = true;
              setHint(false);
              setPos(Number(e.target.value));
            }}
            aria-label="Position du comparateur avant / après"
            className="absolute inset-x-0 bottom-0 h-12 w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
          />
        </div>
      </div>

      <div className="wrap mt-8 md:mt-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4 md:gap-x-10">
            {c.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.8125rem] text-white/55">{k}</dt>
                <dd className="mt-0.5 text-[1.0625rem] font-[600] tracking-[-0.01em]">{v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" className="btn btn-white w-full md:w-auto" onClick={() => goToEstimate(c.estimateAs)}>
            Faire une estimation
          </button>
        </div>
        {site.demo && <p className="mt-6 text-[0.8125rem] text-white/40">Chantiers présentés à titre d&apos;exemple.</p>}
      </div>
    </section>
  );
}
