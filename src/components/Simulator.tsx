"use client";

import { useMemo, useState } from "react";
import { conditions, estimate, heights, propertyTypes, simulatorWorks } from "@/config/offer";
import { AnimatedNumber } from "./AnimatedNumber";
import { useQuote } from "./QuoteContext";
import { Check } from "./icons";

type Work = (typeof simulatorWorks)[number]["id"];
type Property = (typeof propertyTypes)[number]["id"];
type Condition = (typeof conditions)[number]["id"];
type Height = (typeof heights)[number]["id"];

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[0.95rem] font-[600] text-white">{label}</legend>
      <div className="mt-3 grid gap-1 rounded-[16px] bg-white/[0.07] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label
              key={o.id}
              className={`flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-[12px] px-2 py-2 text-center text-[0.9rem] leading-tight transition-colors ${
                on ? "bg-white text-ardoise" : "text-white/75 hover:text-white"
              }`}
            >
              <input type="radio" className="sr-only" name={label} checked={on} onChange={() => onChange(o.id)} />
              <span className="font-[560]">{o.label}</span>
              {o.hint && <span className={`mt-0.5 text-[0.75rem] ${on ? "text-zinc" : "text-white/45"}`}>{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Simulator() {
  const [property, setProperty] = useState<Property>("maison");
  const [surface, setSurface] = useState(140);
  const [work, setWork] = useState<Work>("peinture");
  const [condition, setCondition] = useState<Condition>("moyen");
  const [height, setHeight] = useState<Height>("r1");
  const { goToQuote } = useQuote();

  const est = useMemo(() => estimate({ surface, work, property, condition, height }), [surface, work, property, condition, height]);
  const perM2 = { low: Math.round(est.low / surface), high: Math.round(est.high / surface) };
  const pct = ((surface - 40) / (600 - 40)) * 100;
  const workLabel = simulatorWorks.find((w) => w.id === work)!.label;

  return (
    <section id="simulateur" className="bg-ardoise px-5 py-24 text-white md:py-36" aria-labelledby="sim-title">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-[760px]">
          <h2 id="sim-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
            Votre budget en 30 secondes.
          </h2>
          <p className="lede mt-4 !text-white/65">Une fourchette réaliste, calculée sur nos chantiers récents. Le prix exact vient après la visite gratuite.</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="space-y-8">
            <Segmented label="Type de bien" options={propertyTypes} value={property} onChange={setProperty} />

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="surface" className="text-[0.95rem] font-[600]">
                  Surface de façade
                </label>
                <span className="text-[1.6rem] font-[620] tabular-nums tracking-tight">{surface} m²</span>
              </div>
              <input
                id="surface"
                type="range"
                min={40}
                max={600}
                step={5}
                value={surface}
                onChange={(e) => setSurface(Number(e.target.value))}
                className="range mt-2"
                style={{ ["--p" as string]: `${pct}%` }}
              />
              <p className="mt-1 text-sm text-white/50">Pas sûr ? Une maison de 100 m² habitables sur deux niveaux, c&apos;est environ 130 à 160 m² de façade.</p>
            </div>

            <fieldset>
              <legend className="text-[0.95rem] font-[600]">Travaux</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {simulatorWorks.map((w) => {
                  const on = w.id === work;
                  return (
                    <label
                      key={w.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-[16px] px-4 py-3 transition-colors ${
                        on ? "bg-white text-ardoise" : "bg-white/[0.07] text-white hover:bg-white/[0.11]"
                      }`}
                    >
                      <input type="radio" name="work" className="sr-only" checked={on} onChange={() => setWork(w.id)} />
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${on ? "bg-outremer text-white" : "ring-1 ring-white/30"}`}>
                        {on && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="leading-tight">
                        <span className="block font-[580]">{w.label}</span>
                        <span className={`block text-[0.82rem] ${on ? "text-zinc" : "text-white/50"}`}>{w.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Segmented label="État de la façade" options={conditions} value={condition} onChange={setCondition} />
            <Segmented label="Hauteur" options={heights} value={height} onChange={setHeight} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] bg-white p-7 text-ardoise md:p-9" aria-live="polite">
              <p className="text-[0.95rem] font-[600] text-zinc">Estimation pour {workLabel.toLowerCase()}</p>
              <p className="headline mt-3 flex flex-wrap items-baseline gap-x-3 text-[clamp(2rem,3.4vw,2.9rem)] tabular-nums" style={{ fontStretch: "100%" }}>
                <span className="whitespace-nowrap">
                  <AnimatedNumber value={est.low} /> €
                </span>
                <span className="text-[0.6em] font-[500] text-zinc">à</span>
                <span className="whitespace-nowrap">
                  <AnimatedNumber value={est.high} /> €
                </span>
              </p>
              <p className="mt-2 text-zinc">
                Soit {perM2.low} à {perM2.high} € TTC par m² de façade.
              </p>

              <ul className="mt-7 space-y-2.5 border-t border-ligne pt-6 text-[0.97rem]">
                {["Visite et diagnostic offerts", "Échafaudage et protections inclus", "Nettoyage du chantier chaque soir", "Garantie décennale"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="h-5 w-5 text-outremer" />
                    {t}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn btn-primary mt-8 w-full !h-14 text-[1.05rem]"
                onClick={() =>
                  goToQuote({
                    works: [workLabel],
                    property: propertyTypes.find((p) => p.id === property)!.label,
                    surface,
                    estimate: est,
                    source: "simulateur",
                  })
                }
              >
                Recevoir mon devis précis
              </button>
              <p className="mt-4 text-center text-[0.82rem] text-zinc">Estimation indicative TTC, hors réparations structurelles. Le prix final est fixé après visite.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
