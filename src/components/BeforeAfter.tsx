"use client";

import { useState } from "react";
import { StaticFacade } from "./facade/Facade";
import type { Variant } from "./facade/specs";

const cases: { id: Variant; label: string; wall: string; accent: string; text: string }[] = [
  {
    id: "pavillon",
    label: "Pavillon",
    wall: "#E8DDC7",
    accent: "#3E5A4A",
    text: "Nettoyage, traitement des fissures et deux couches de peinture minérale. Compter 1 à 2 semaines pour un pavillon.",
  },
  {
    id: "maison",
    label: "Maison de ville",
    wall: "#DDAA94",
    accent: "#3D434A",
    text: "Démoussage, reprise d'enduit et peinture, garde-corps et volets repeints. Compter 2 semaines environ.",
  },
  {
    id: "immeuble",
    label: "Immeuble",
    wall: "#F2EFE8",
    accent: "#3D434A",
    text: "Ravalement complet en copropriété, avec suivi du syndic et planning partagé. Compter 4 à 8 semaines selon la hauteur.",
  },
];

export function BeforeAfter() {
  const [active, setActive] = useState<Variant>("pavillon");
  const [pos, setPos] = useState(50);
  const c = cases.find((x) => x.id === active)!;

  return (
    <section id="avant-apres" className="bg-pierre px-5 py-24 md:py-36" aria-labelledby="ba-title">
      <div className="mx-auto max-w-[1100px] text-center">
        <h2 id="ba-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
          Glissez pour voir la différence.
        </h2>
        <p className="lede mx-auto mt-4 max-w-[42ch]">Même maison, même jour. Juste dix ans de pluie et de pollution en moins.</p>

        <div role="tablist" aria-label="Type de bâtiment" className="mx-auto mt-10 inline-flex rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_rgba(26,30,36,0.06)]">
          {cases.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={active === x.id}
              onClick={() => {
                setActive(x.id);
                setPos(50);
              }}
              className={`h-10 rounded-full px-4 text-[0.95rem] font-[540] transition-colors md:px-6 ${
                active === x.id ? "bg-ardoise text-white" : "text-zinc hover:text-ardoise"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-8 aspect-[4/3] md:aspect-[720/520] w-full max-w-[980px] select-none overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f7_70%,#e9ecef_100%)]">
          <StaticFacade
            variant={active}
            state="after"
            wallColor={c.wall}
            accentColor={c.accent}
            className="absolute inset-0 h-full w-full"
            title={`${c.label} après rénovation`}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <StaticFacade variant={active} state="before" wallColor={c.wall} accentColor={c.accent} className="absolute inset-0 h-full w-full" title={`${c.label} avant rénovation`} />
          </div>

          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ardoise/80 px-3 py-1 text-sm font-[560] text-white backdrop-blur md:left-6 md:top-6">Avant</span>
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-[560] text-ardoise shadow-[0_2px_10px_rgba(26,30,36,0.12)] md:right-6 md:top-6">Après</span>

          {/* poignée */}
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden>
            <div className="absolute inset-y-0 -left-px w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
            <div className="absolute top-1/2 -ml-6 -mt-6 grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_6px_24px_rgba(26,30,36,0.25)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ardoise" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparer avant et après"
            aria-valuetext={`${Math.round(pos)} % avant`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>

        <p className="mx-auto mt-6 max-w-[56ch] text-zinc">{c.text}</p>
      </div>
    </section>
  );
}
