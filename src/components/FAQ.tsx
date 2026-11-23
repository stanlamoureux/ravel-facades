"use client";

import { useState } from "react";
import { faq } from "@/config/faq";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Chevron, Phone } from "./icons";

/**
 * Les questions fréquentes : on choisit un sujet, une seule réponse s'affiche.
 * Sur téléphone les sujets sont des pastilles d'un mot ; sur ordinateur, la liste des questions.
 * Toutes les réponses restent dans la page (masquées), pour les moteurs de recherche.
 */
export function FAQ() {
  const [open, setOpen] = useState(0);
  const { goToEstimate } = useQuote();

  return (
    <section id="faq" className="pb-14 md:pb-[min(7rem,11svh)]" aria-labelledby="faq-title">
      <div className="wrap">
        <h2 id="faq-title" className="t-h2">
          Vos questions, nos réponses.
        </h2>

        <div className="mt-6 grid gap-x-10 gap-y-4 md:mt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div role="tablist" aria-label="Sujets" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {faq.map((f, i) => {
              const on = i === open;
              return (
                <button
                  key={f.q}
                  type="button"
                  role="tab"
                  id={`faq-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(i)}
                  className={`group flex h-11 shrink-0 items-center justify-between gap-4 rounded-full px-[1.125rem] text-left text-[0.9375rem] font-[600] transition-colors duration-200 lg:h-auto lg:w-full lg:rounded-[18px] lg:px-5 lg:py-[0.9rem] lg:text-[1.0625rem] lg:tracking-[-0.01em] ${
                    on ? "bg-encre text-white" : "bg-gris text-encre hover:bg-gris-2 lg:bg-transparent lg:hover:bg-gris"
                  }`}
                >
                  <span className="lg:hidden">{f.topic}</span>
                  <span className="hidden lg:inline">{f.q}</span>
                  <Chevron className={`hidden h-5 w-5 shrink-0 transition-transform duration-200 lg:block ${on ? "translate-x-0.5" : "text-brume group-hover:translate-x-0.5"}`} />
                </button>
              );
            })}
          </div>

          <div className="rounded-[26px] bg-gris p-6 md:rounded-[32px] md:p-10 lg:flex lg:min-h-[25rem] lg:flex-col">
            {faq.map((f, i) => (
              <div key={f.q} role="tabpanel" id={`faq-panel-${i}`} aria-labelledby={`faq-tab-${i}`} hidden={i !== open} className={i === open ? "apparait" : undefined}>
                <h3 className="max-w-[20ch] text-[1.5rem] font-[650] leading-[1.15] tracking-[-0.03em] md:text-[2rem]">{f.q}</h3>
                <p className="mt-3.5 max-w-[52ch] text-[1.0625rem] leading-[1.55] text-ardoise md:mt-5 md:text-[1.125rem]">{f.a}</p>
                {i === 0 && (
                  <button type="button" className="link mt-4 font-[600]" onClick={() => goToEstimate()}>
                    Chiffrer mes travaux
                  </button>
                )}
              </div>
            ))}
            <a href={`tel:${site.phoneHref}`} className="mt-7 flex items-center gap-3.5 border-t border-encre/10 pt-5 lg:mt-auto">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-appel text-white">
                <Phone className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.875rem] text-ardoise">Une autre question ?</span>
                <span className="block text-[1.125rem] font-[650] tabular-nums tracking-[-0.02em]">{site.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
