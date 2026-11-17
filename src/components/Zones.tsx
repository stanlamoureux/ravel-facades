"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Check, Pin } from "./icons";

export function Zones() {
  const [cp, setCp] = useState("");
  const { goToQuote } = useQuote();
  const zone = cp.length === 5 ? site.zones.find((z) => cp.startsWith(z.code)) : undefined;
  const checked = cp.length === 5;

  return (
    <section id="zones" className="py-14 md:py-32" aria-labelledby="zones-title">
      <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <h2 id="zones-title" className="t-h2 max-w-[12ch]">
            On se déplace chez vous ?
          </h2>
          <p className="t-lede mt-4 max-w-[36ch] md:mt-6">
            Nos équipes partent d&apos;{site.address.city} et couvrent l&apos;Essonne et les départements voisins.
          </p>

          <div className="mt-8 max-w-[26rem]">
            <label htmlFor="cp" className="t-label">
              Votre code postal
            </label>
            <div className="relative mt-2">
              <Pin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brume" />
              <input
                id="cp"
                className="field !h-14 !pl-12 text-[1.0625rem] tabular-nums"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="91000"
                value={cp}
                onChange={(e) => setCp(e.target.value.replace(/\D/g, ""))}
                aria-describedby="cp-result"
              />
            </div>
            <div id="cp-result" className="mt-3 min-h-[1.5rem] text-[0.9375rem]" aria-live="polite">
              {checked && zone && (
                <p className="flex items-start gap-2.5 text-volet">
                  <Check className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    <span className="font-[620]">Oui, nous intervenons en {zone.name}.</span>{" "}
                    <button type="button" className="link !text-volet" onClick={() => goToQuote({ source: "zones" })}>
                      Demander une visite gratuite
                    </button>
                  </span>
                </p>
              )}
              {checked && !zone && (
                <p className="text-ardoise">
                  Ce secteur est hors de notre zone habituelle. Appelez-nous au{" "}
                  <a className="link tabular-nums" href={`tel:${site.phoneHref}`}>
                    {site.phone}
                  </a>
                  , selon le chantier on peut s&apos;arranger.
                </p>
              )}
            </div>
          </div>
        </div>

        <ul className="border-t border-trait lg:mt-3">
          {site.zones.map((z) => (
            <li key={z.code} className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 border-b border-trait py-4 md:grid-cols-[4rem_11rem_1fr] md:py-5">
              <span className="text-[1.375rem] font-[650] tabular-nums tracking-[-0.03em] text-brume md:text-[1.5rem]">{z.code}</span>
              <span className="text-[1.0625rem] font-[620] tracking-[-0.01em] md:text-[1.125rem]">{z.name}</span>
              <span className="col-start-2 mt-0.5 text-[0.9375rem] leading-[1.45] text-ardoise md:col-start-3 md:mt-0">{z.cities.join(", ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
