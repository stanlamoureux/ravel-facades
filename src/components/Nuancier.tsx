"use client";

import { useState } from "react";
import { accentColors, wallColors } from "@/config/offer";
import { StaticFacade } from "./facade/Facade";
import { useQuote } from "./QuoteContext";
import { Check } from "./icons";
import type { Variant } from "./facade/specs";

export function Nuancier() {
  const [wall, setWall] = useState<(typeof wallColors)[number]>(wallColors[1]);
  const [accent, setAccent] = useState<(typeof accentColors)[number]>(accentColors[2]);
  const [variant, setVariant] = useState<Variant>("pavillon");
  const { goToQuote } = useQuote();

  return (
    <section id="teintes" className="px-5 py-24 md:py-36" aria-labelledby="teintes-title">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="order-2 lg:order-1">
          <div className="tile relative bg-[linear-gradient(180deg,#f7f8fa_0%,#eceff2_100%)] p-4 md:p-8">
            <StaticFacade variant={variant} state="after" wallColor={wall.hex} accentColor={accent.hex} className="block w-full" title={`Aperçu en ${wall.name}, volets ${accent.name}`} />
            <div className="absolute left-4 top-4 flex gap-1 rounded-full bg-white/85 p-1 backdrop-blur md:left-6 md:top-6">
              {(["pavillon", "maison"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  aria-pressed={variant === v}
                  className={`h-8 rounded-full px-3 text-sm font-[540] transition-colors ${variant === v ? "bg-ardoise text-white" : "text-zinc hover:text-ardoise"}`}
                >
                  {v === "pavillon" ? "Pavillon" : "Maison de ville"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 id="teintes-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
            Essayez votre teinte avant de choisir.
          </h2>
          <p className="lede mt-4">Choisissez la couleur du mur et des menuiseries. On l&apos;apporte en échantillon lors de la visite.</p>

          <fieldset className="mt-8">
            <legend className="text-[0.95rem] font-[600]">Mur</legend>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {wallColors.map((c) => {
                const on = c.id === wall.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setWall(c)}
                    aria-pressed={on}
                    aria-label={`${c.name}, ${c.ref}`}
                    className={`group overflow-hidden rounded-[14px] bg-white text-left shadow-[0_0_0_1px_rgba(26,30,36,0.08)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 ${
                      on ? "!shadow-[0_0_0_2.5px_#2A3FF5]" : ""
                    }`}
                  >
                    <span className="relative block h-14" style={{ background: c.hex }}>
                      {on && (
                        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-outremer text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </span>
                    <span className="block px-2 pb-2 pt-1.5">
                      <span className="block truncate text-[0.78rem] font-[600] leading-tight">{c.name}</span>
                      <span className="block text-[0.7rem] text-zinc">{c.ref}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[0.95rem] font-[600]">
              Volets et menuiseries <span className="font-normal text-zinc">({accent.name})</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {accentColors.map((c) => {
                const on = c.id === accent.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setAccent(c)}
                    aria-pressed={on}
                    aria-label={c.name}
                    title={c.name}
                    className={`h-10 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform hover:scale-105 ${on ? "ring-[2.5px] ring-outremer ring-offset-[3px]" : ""}`}
                    style={{ background: c.hex }}
                  />
                );
              })}
            </div>
          </fieldset>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goToQuote({ color: `${wall.name} (${wall.ref})`, accent: accent.name, works: ["Peinture"], source: "nuancier" })}
            >
              Demander un devis en {wall.name}
            </button>
          </div>
          <p className="mt-4 text-sm text-zinc">Rendu indicatif. Certaines communes encadrent les teintes autorisées, on vérifie pour vous avant les travaux.</p>
        </div>
      </div>
    </section>
  );
}
