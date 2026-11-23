"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Check, Pin } from "./icons";

/**
 * Les villes de la carte, placées à vol d'oiseau depuis Soings-en-Sologne :
 * x = km vers l'est, y = km vers le sud. `side` : de quel côté du point va le nom.
 */
const towns = [
  { name: "Blois", d: "41", x: -14, y: -20, side: "l" },
  { name: "Vendôme", d: "41", x: -34, y: -42, side: "r" },
  { name: "Lamotte-Beuvron", d: "41", x: 38, y: -21, side: "l" },
  { name: "Romorantin", d: "41", x: 16.5, y: 5.5, side: "r" },
  { name: "Selles-sur-Cher", d: "41", x: 2.3, y: 14.4, side: "r" },
  { name: "Saint-Aignan", d: "41", x: -11.3, y: 15.5, side: "l" },
  { name: "Montrichard", d: "41", x: -25.6, y: 7.8, side: "l" },
  { name: "Amboise", d: "37", x: -40.6, y: 0, side: "l" },
  { name: "Loches", d: "37", x: -39, y: 31, side: "l" },
  { name: "Valençay", d: "36", x: 3.8, y: 28, side: "r" },
  { name: "Vierzon", d: "18", x: 41, y: 21, side: "r" },
  { name: "Orléans", d: "45", x: 29, y: -54, side: "r" },
] as const;

export function Zones() {
  const [cp, setCp] = useState("");
  const { goToQuote } = useQuote();
  const checked = cp.length === 5;
  const zone = checked ? site.zones.find((z) => cp.startsWith(z.code)) : undefined;

  return (
    <section id="zones" className="py-14 md:py-[min(7rem,11svh)]" aria-labelledby="zones-title">
      <div className="wrap grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <h2 id="zones-title" className="t-h2 max-w-[12ch]">
            On se déplace chez vous ?
          </h2>
          <p className="t-lede mt-3 max-w-[34ch] md:mt-5">Tapez votre code postal, la réponse est immédiate.</p>

          <div className="mt-6 max-w-[26rem] md:mt-8">
            <label htmlFor="cp" className="sr-only">
              Votre code postal
            </label>
            <div className="relative">
              <Pin className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brume" />
              <input
                id="cp"
                className="field !h-16 !rounded-[20px] !pl-[3.25rem] text-[1.25rem] font-[600] tabular-nums tracking-[0.02em] placeholder:font-normal"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="Code postal"
                value={cp}
                onChange={(e) => setCp(e.target.value.replace(/\D/g, ""))}
                aria-describedby="cp-result"
              />
            </div>
            <div id="cp-result" className="mt-3 min-h-[3rem] text-[0.9375rem] leading-[1.45]" aria-live="polite">
              {checked && zone && (
                <p key={cp} className="apparait flex items-start gap-2.5 text-volet">
                  <span className="mt-px grid h-[1.375rem] w-[1.375rem] shrink-0 place-items-center rounded-full bg-volet text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>
                    <span className="font-[640]">Oui, on intervient en {zone.name}.</span>{" "}
                    <button type="button" className="link !text-volet" onClick={() => goToQuote({ source: "zones" })}>
                      Demander une visite gratuite
                    </button>
                  </span>
                </p>
              )}
              {checked && !zone && (
                <p key={cp} className="apparait text-ardoise">
                  C&apos;est hors de notre secteur habituel. Appelez le{" "}
                  <a className="link whitespace-nowrap tabular-nums" href={`tel:${site.phoneHref}`}>
                    {site.phone}
                  </a>
                  , selon le chantier on peut s&apos;arranger.
                </p>
              )}
            </div>
          </div>

          {/* les départements couverts, en une ligne à parcourir du regard */}
          <ul className="mt-3 flex flex-wrap gap-2 md:mt-5" aria-label="Départements couverts">
            {site.zones.map((z) => {
              const on = zone?.code === z.code;
              return (
                <li key={z.code} className={`flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-[0.9375rem] font-[580] transition-colors duration-300 ${on ? "bg-volet text-white" : "bg-gris text-encre"}`}>
                  <span className={`grid h-7 min-w-7 place-items-center rounded-full px-1 text-[0.8125rem] font-[680] tabular-nums ${on ? "bg-white/20" : "bg-white"}`}>{z.code}</span>
                  {z.name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* la carte : des cercles tous les 20 km autour de l'atelier */}
        <figure className="relative overflow-hidden rounded-[28px] bg-encre text-white md:rounded-[32px]">
          <svg viewBox="-68 -68 136 136" className="block w-full" role="img" aria-label={`Carte du secteur : ${towns.map((t) => t.name).join(", ")}, dans un rayon de 60 km autour de ${site.address.city}`}>
            <defs>
              <radialGradient id="zone-halo">
                <stop offset="0" stopColor="#c8451c" stopOpacity="0.34" />
                <stop offset="0.55" stopColor="#c8451c" stopOpacity="0.1" />
                <stop offset="1" stopColor="#c8451c" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle r="62" fill="url(#zone-halo)" />
            {[20, 40, 60].map((r) => (
              <g key={r}>
                <circle r={r} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="0.35" strokeDasharray={r === 60 ? "1.2 1.6" : undefined} />
                <rect x="-8" y={r - 2.6} width="16" height="5.2" rx="2.6" fill="#0e1a26" />
                <text x="0" y={r + 1.35} textAnchor="middle" fontSize="3.6" fontWeight="600" fill="#fff" fillOpacity="0.5">
                  {r} km
                </text>
              </g>
            ))}
            {towns.map((t) => {
              const dim = zone && zone.code !== t.d;
              const left = t.side === "l";
              return (
                <g key={t.name} opacity={dim ? 0.3 : 1} style={{ transition: "opacity 0.3s" }}>
                  <circle cx={t.x} cy={t.y} r="1.25" fill="#fff" />
                  <text x={t.x + (left ? -3 : 3)} y={t.y + 1.55} textAnchor={left ? "end" : "start"} fontSize="4.5" fontWeight="560" fill="#fff" fillOpacity="0.92" letterSpacing="-0.05">
                    {t.name}
                  </text>
                </g>
              );
            })}
            {/* l'atelier */}
            <circle r="4.6" fill="#c8451c" fillOpacity="0.3" />
            <circle r="2.1" fill="#c8451c" stroke="#fff" strokeWidth="0.7" />
            <text x="0" y="-6.4" textAnchor="middle" fontSize="4.9" fontWeight="700" fill="#fff" letterSpacing="-0.08">
              {site.address.city}
            </text>
          </svg>
          <figcaption className="absolute left-0 top-0 px-5 pt-4 text-[0.8125rem] text-white/50 md:px-6 md:pt-5">Distances à vol d&apos;oiseau</figcaption>
        </figure>
      </div>
    </section>
  );
}
