"use client";

import Image from "next/image";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Phone, Shield, Star } from "./icons";

type View = "avant" | "apres";

/**
 * Le hero : une vraie façade, d'abord telle qu'on la trouve, puis telle qu'on la rend.
 * Au chargement l'après balaie l'avant une seule fois ; ensuite c'est le visiteur qui bascule.
 */
export function Hero() {
  const frame = useRef<HTMLDivElement>(null);
  const p = useMotionValue(0);
  const [view, setView] = useState<View>("avant");
  const [loaded, setLoaded] = useState(0);
  const [moving, setMoving] = useState(false);
  const started = useRef(false);
  const { goToQuote } = useQuote();

  useMotionValueEvent(p, "change", (v) => frame.current?.style.setProperty("--p", String(v)));

  const go = useCallback(
    (to: View, duration = 1.1) => {
      setView(to);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return p.set(to === "apres" ? 1 : 0);
      setMoving(true);
      animate(p, to === "apres" ? 1 : 0, { duration, ease: [0.65, 0, 0.35, 1], onComplete: () => setMoving(false) });
    },
    [p],
  );

  // premier dévoilement : dès que les deux photos sont là (ou au bout de 3 s quoi qu'il arrive)
  useEffect(() => {
    if (started.current) return;
    const start = () => {
      if (started.current) return;
      started.current = true;
      go("apres", 1.7);
    };
    if (loaded >= 2) {
      const t = window.setTimeout(start, 650);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(start, 3000);
    return () => window.clearTimeout(t);
  }, [loaded, go]);

  const onLoad = () => setLoaded((n) => n + 1);

  return (
    <section id="top" className="relative isolate md:pb-14 md:pt-[88px]" aria-labelledby="hero-title">
      <noscript>
        <style>{`.reveal{--p:1}`}</style>
      </noscript>
      <div className="md:mx-auto md:grid md:w-full md:max-w-[1200px] md:px-8 md:min-h-[calc(100svh-144px)] md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:items-center md:gap-10 lg:gap-16">
        {/* La photo */}
        <div
          ref={frame}
          className="reveal relative h-[100svh] max-h-[960px] min-h-[600px] overflow-hidden bg-[#2a6a9e] md:order-2 md:h-[min(calc(100svh-144px),800px)] md:min-h-[520px] md:rounded-[36px]"
        >
          <Image
            src="/images/maison-avant.webp"
            alt="Maison de ville avant ravalement : enduit noirci par les coulures, mousses et volets écaillés"
            fill
            priority
            quality={85}
            sizes="(min-width: 768px) 46vw, 130vw"
            className="object-cover object-bottom"
            onLoad={onLoad}
          />
          <div className="reveal-after absolute inset-0">
            <Image
              src="/images/maison-apres.webp"
              alt="La même maison après ravalement : enduit clair, volets verts repeints"
              fill
              priority
              quality={85}
              sizes="(min-width: 768px) 46vw, 130vw"
              className="object-cover object-bottom"
              onLoad={onLoad}
            />
          </div>
          <div
            className={`reveal-line pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_24px_rgb(255_255_255/0.7)] transition-opacity duration-300 ${moving ? "opacity-100" : "opacity-0"}`}
            aria-hidden
          />
          {/* voiles pour la lisibilité du texte posé sur la photo (mobile) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-[#0b2740]/55 via-[#0b2740]/20 to-transparent md:hidden" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#07131d]/85 via-[#07131d]/45 to-transparent md:h-[26%] md:from-[#07131d]/55 md:via-[#07131d]/15" aria-hidden />

          <div className="absolute bottom-[136px] left-5 md:bottom-6 md:left-6" role="group" aria-label="Voir la façade avant ou après les travaux">
            <div className="glass relative grid grid-cols-2 rounded-full p-1 text-[0.9375rem] font-[600] text-white">
              <span
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: view === "apres" ? "translateX(100%)" : "translateX(0)" }}
                aria-hidden
              />
              {(["avant", "apres"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => go(v)}
                  className={`relative h-10 rounded-full px-5 transition-colors duration-300 ${view === v ? "text-encre" : "text-white"}`}
                >
                  {v === "avant" ? "Avant" : "Après"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Le texte : posé sur la photo en mobile, dans sa colonne à partir de la tablette */}
        <div className="pointer-events-none absolute inset-0 flex max-h-[960px] flex-col justify-between hero-copy px-5 pb-6 pt-[88px] text-white md:pointer-events-auto md:static md:order-1 md:block md:max-h-none md:p-0 md:text-encre">
          <div>
            <h1 id="hero-title" className="hero-title t-display text-[clamp(2.6rem,12.4vw,3.4rem)] md:text-[clamp(2.75rem,5.5vw,5.25rem)]">
              Votre façade,
              <br />
              comme neuve.
            </h1>
            <p className="mt-3.5 max-w-[29ch] text-[1.0625rem] font-[480] leading-[1.38] text-white/95 md:mt-7 md:max-w-[34ch] md:text-[1.3125rem] md:font-normal md:leading-[1.45] md:text-ardoise">
              Ravalement, peinture et nettoyage de façade en Sologne et dans le Loir-et-Cher.<span className="hidden md:inline"> Visite et devis gratuits sous {site.quoteDelay}.</span>
            </p>
          </div>

          <div className="pointer-events-auto md:mt-10">
            <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3">
              <a href={`tel:${site.phoneHref}`} className="btn btn-white !px-3 md:hidden">
                <Phone className="h-5 w-5" />
                Appeler
              </a>
              <button type="button" className="btn btn-cta !px-3 md:hidden" onClick={() => goToQuote({ source: "hero" })}>
                Devis gratuit
              </button>
              <button type="button" className="btn btn-cta hidden md:inline-flex md:h-14 md:px-7 md:text-[1.0625rem]" onClick={() => goToQuote({ source: "hero" })}>
                Demander mon devis gratuit
              </button>
              <a href={`tel:${site.phoneHref}`} className="btn btn-soft hidden tabular-nums md:inline-flex md:h-14 md:px-6 md:text-[1.0625rem]">
                <Phone className="h-5 w-5" />
                {site.phone}
              </a>
            </div>
            <ul className="mt-4 flex items-center justify-between gap-4 text-[0.8125rem] font-[540] text-white/90 md:mt-9 md:justify-start md:gap-8 md:text-[0.9375rem] md:text-ardoise">
              <li className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[#ffc94d] md:text-tuile" />
                <span>
                  <span className="text-white md:text-encre">Steevy GARAND</span>, façadier
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Visite et devis gratuits
              </li>
              <li className="hidden items-center gap-1.5 lg:flex">Loir-et-Cher et alentours</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
