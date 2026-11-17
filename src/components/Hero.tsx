"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Facade, StaticFacade } from "./facade/Facade";
import { site } from "@/config/site";
import { Shield, Star, Clock } from "./icons";

const WALL_TO = "#EADCBF";
const ACCENT_FROM = "#8C918A";
const ACCENT_TO = "#3E5A4A";

const steps = [
  {
    label: "Diagnostic",
    title: "Diagnostic offert.",
    body: `On mesure chaque mur, on sonde l'enduit, on repère fissures et humidité. Devis détaillé poste par poste sous ${site.quoteDelay}.`,
    range: [0.08, 0.3] as const,
  },
  {
    label: "Nettoyage",
    title: "Nettoyage en profondeur.",
    body: "Lavage basse pression et traitement anti-mousse. Coulures noires, pollution et lichen disparaissent sans abîmer le support.",
    range: [0.3, 0.53] as const,
  },
  {
    label: "Protection",
    title: "Protection durable.",
    body: "Fissures ouvertes et rebouchées, puis hydrofuge. L'eau perle, la façade respire.",
    range: [0.53, 0.7] as const,
  },
  {
    label: "Finition",
    title: "Finition impeccable.",
    body: `Deux couches de peinture minérale, dans la teinte que vous avez choisie. Chantier rendu propre, garanti ${site.guaranteeYears} ans.`,
    range: [0.7, 0.89] as const,
  },
];

function Trust({ dark = false }: { dark?: boolean }) {
  const c = dark ? "text-white/70" : "text-zinc";
  return (
    <ul className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.92rem] ${c}`}>
      <li className="flex items-center gap-1.5">
        <span className="flex text-[#F5B301]">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4" />
          ))}
        </span>
        <span>
          <strong className="font-[620] text-ardoise">{site.rating.value.toLocaleString("fr-FR")}/5</strong> sur {site.rating.count} avis
        </span>
      </li>
      <li className="flex items-center gap-1.5">
        <Shield className="h-[18px] w-[18px] text-outremer" />
        Garantie décennale
      </li>
      <li className="flex items-center gap-1.5">
        <Clock className="h-[18px] w-[18px] text-outremer" />
        Devis gratuit sous {site.quoteDelay}
      </li>
    </ul>
  );
}

function CTAs({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <a href="#devis" className="btn btn-primary">
        Demander mon devis gratuit
      </a>
      <a href="#simulateur" className="btn btn-ghost hidden sm:inline-flex">
        Estimer le prix en 30 s
      </a>
    </div>
  );
}

export function Hero() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (reduce) return <HeroStatic />;
  return <HeroScroll />;
}

function HeroStatic() {
  return (
    <section id="top" className="px-5 pb-16 pt-28 text-center">
      <h1 className="display mx-auto max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.6rem)]">Votre façade, comme au premier jour.</h1>
      <p className="lede mx-auto mt-5 max-w-[46ch]">
        Nettoyage, ravalement et peinture de façades en Île-de-France. Visite et devis gratuits, travaux garantis {site.guaranteeYears} ans.
      </p>
      <CTAs className="mt-8" />
      <StaticFacade variant="pavillon" state="after" wallColor={WALL_TO} accentColor={ACCENT_TO} className="mx-auto mt-10 w-full max-w-[860px]" />
      <div className="mt-6">
        <Trust />
      </div>
      <ol className="mx-auto mt-14 grid max-w-[1100px] gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.label}>
            <p className="text-sm font-[600] text-outremer">Étape {i + 1}</p>
            <h2 className="headline mt-1 text-2xl">{s.title}</h2>
            <p className="mt-2 text-zinc">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function useWindow(p: MotionValue<number>, [a, b]: readonly [number, number], fade = 0.025) {
  return useTransform(p, [a, a + fade, b - fade, b], [0, 1, 1, 0]);
}

function HeroScroll() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  const diag = useTransform(p, [0.1, 0.17, 0.27, 0.31], [0, 1, 1, 0]);
  const scan = useTransform(p, [0.09, 0.26], [0, 1]);
  const clean = useTransform(p, [0.31, 0.52], [0, 1]);
  const protect = useTransform(p, [0.54, 0.69], [0, 1]);
  const paint = useTransform(p, [0.71, 0.88], [0, 1]);
  const accentColor = useTransform(paint, [0.3, 1], [ACCENT_FROM, ACCENT_TO]);

  const introOpacity = useTransform(p, [0, 0.045, 0.08], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.08], [0, -30]);
  const introVis = useTransform(introOpacity, (v) => (v > 0.02 ? "visible" : "hidden"));
  const finalOpacity = useTransform(p, [0.89, 0.93], [0, 1]);
  const finalVis = useTransform(finalOpacity, (v) => (v > 0.02 ? "visible" : "hidden"));
  const barOpacity = useTransform(p, [0.06, 0.1, 0.88, 0.92], [0, 1, 1, 0]);
  const trustOpacity = useTransform(p, [0, 0.05, 0.08, 0.89, 0.93], [1, 1, 0, 0, 1]);
  const progress = useTransform(p, [0.08, 0.89], [0, 1]);
  const scale = useTransform(p, [0, 0.1, 0.89, 1], [0.97, 1, 1, 0.97]);

  const [active, setActive] = useState(-1);
  useMotionValueEvent(p, "change", (v) => {
    const i = steps.findIndex((s) => v >= s.range[0] && v < s.range[1]);
    setActive(i);
  });

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    const target = steps[i].range[0] + (steps[i].range[1] - steps[i].range[0]) * 0.55;
    window.scrollTo({ top: top + total * target, behavior: "smooth" });
  };

  return (
    <section id="top" ref={track} className="relative h-[480vh] md:h-[540vh]" aria-label="Votre façade, comme au premier jour">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-16">
        {/* zone de texte */}
        <div className="relative mx-auto h-[clamp(250px,36svh,300px)] w-full max-w-[1100px] shrink-0 px-5 sm:h-[clamp(262px,35svh,322px)]">
          <motion.div style={{ opacity: introOpacity, y: introY, visibility: introVis }} className="absolute inset-x-5 top-[clamp(8px,2.5svh,32px)] text-center">
            <h1 className="display mx-auto max-w-[20ch] text-[clamp(2.4rem,5.2vw,4.6rem)]">Votre façade, comme au premier jour.</h1>
            <p className="lede mx-auto mt-3 max-w-[60ch]">
              Nettoyage, ravalement et peinture de façades en Île-de-France. Visite et devis gratuits, travaux garantis {site.guaranteeYears} ans.
            </p>
            <CTAs className="mt-5" />
          </motion.div>

          {steps.map((s, i) => (
            <StepText key={s.label} p={p} step={s} index={i} />
          ))}

          <motion.div style={{ opacity: finalOpacity, visibility: finalVis }} className="absolute inset-x-5 top-[clamp(8px,2.5svh,32px)] text-center">
            <h2 className="display mx-auto max-w-[20ch] text-[clamp(2.4rem,5.2vw,4.6rem)]">Le même résultat, chez vous.</h2>
            <p className="lede mx-auto mt-3 max-w-[60ch]">Visite gratuite, devis détaillé sous {site.quoteDelay}. Sans engagement.</p>
            <CTAs className="mt-5" />
          </motion.div>
        </div>

        {/* façade */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-1 sm:items-end sm:px-3">
          <motion.div style={{ scale }} className="flex h-full w-full max-w-[920px] items-center justify-center sm:items-end">
            <Facade
              variant="pavillon"
              clean={clean}
              protect={protect}
              paint={paint}
              diag={diag}
              scan={scan}
              wallColor={WALL_TO}
              accentColor={accentColor}
              viewBox="36 92 728 524"
              className="h-full max-h-full w-auto max-w-full"
              title="Une façade de pavillon qui passe de sale à rénovée au fil du défilement"
            />
          </motion.div>
        </div>

        {/* barre d'étapes / réassurance */}
        <div className="relative h-[74px] shrink-0 md:h-[84px]">
          <motion.div style={{ opacity: trustOpacity }} className="absolute inset-x-0 top-3 px-5">
            <Trust />
          </motion.div>
          <motion.div style={{ opacity: barOpacity }} className="absolute inset-x-0 top-2 mx-auto max-w-[760px] px-5">
            <div className="relative h-[3px] overflow-hidden rounded-full bg-pierre-2">
              <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left rounded-full bg-outremer" />
            </div>
            <ol className="mt-3 grid grid-cols-4 text-center text-[0.82rem] md:text-[0.9rem]">
              {steps.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    className={`rounded-full px-2 py-1 transition-colors ${active === i ? "font-[620] text-ardoise" : "text-zinc hover:text-ardoise"}`}
                    aria-current={active === i ? "step" : undefined}
                  >
                    <span className="mr-1 tabular-nums text-zinc-2">{i + 1}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StepText({ p, step, index }: { p: MotionValue<number>; step: (typeof steps)[number]; index: number }) {
  const opacity = useWindow(p, step.range);
  const y = useTransform(p, [step.range[0], step.range[0] + 0.03, step.range[1] - 0.03, step.range[1]], [24, 0, 0, -24]);
  const visibility = useTransform(opacity, (v) => (v > 0.02 ? "visible" : "hidden"));
  return (
    <motion.div style={{ opacity, y, visibility }} className="absolute inset-x-5 top-[clamp(8px,3svh,40px)] text-center">
      <p className="text-[0.95rem] font-[600] text-outremer">Étape {index + 1} sur 4</p>
      <h2 className="display mx-auto mt-2 max-w-[20ch] text-[clamp(2.2rem,4.8vw,4.2rem)]">{step.title}</h2>
      <p className="lede mx-auto mt-3 max-w-[52ch]">{step.body}</p>
    </motion.div>
  );
}
