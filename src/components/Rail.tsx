"use client";

import Image from "next/image";
import { chapterAnchor, chapters } from "@/config/chapters";
import { site } from "@/config/site";
import { useReadingProgress } from "@/lib/useProgress";
import { useQuote } from "./QuoteContext";
import { Logo } from "./Nav";
import { Check, Phone } from "./icons";

/**
 * Sommaire fixe à gauche, sur grand écran : les quatre métiers puis le contact.
 * Le chapitre en cours se détache en carte blanche, et sa barre se remplit au fil de la lecture.
 */
export function Rail() {
  const progress = useReadingProgress();
  const { goToQuote } = useQuote();
  const active = progress < 0 ? -1 : Math.min(chapters.length - 1, Math.floor(progress));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-encre/[0.07] bg-[#f4f4f6] lg:flex" aria-label="Sommaire">
      <a href="#top" className="flex h-[72px] shrink-0 items-center px-6" aria-label={`${site.name}, retour en haut de page`}>
        <Logo />
      </a>

      <nav className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-3 py-4" aria-label="Chapitres">
        <p className="mb-3 px-3 text-[0.8125rem] font-[560] text-brume">Nos métiers</p>
        <ol className="space-y-1">
          {chapters.map((c, i) => {
            const on = i === active;
            const done = i < active;
            const contact = c.photo === null;
            const fill = on ? Math.min(1, Math.max(0, progress - i)) : done ? 1 : 0;
            return (
              <li key={c.id} className={contact ? "pt-3" : ""}>
                {contact && <div className="mx-3 mb-3 h-px bg-encre/[0.08]" aria-hidden />}
                <a
                  href={`#${chapterAnchor(c.id)}`}
                  aria-current={on ? "location" : undefined}
                  className={`group relative flex items-center gap-3 rounded-[20px] p-2 pr-3 transition-[background-color,box-shadow] duration-300 ${
                    on ? "bg-white shadow-[0_10px_30px_-14px_rgb(14_26_38/0.35),0_0_0_1px_rgb(14_26_38/0.04)]" : "hover:bg-white/70"
                  }`}
                >
                  <span className="relative shrink-0">
                    <span
                      className={`grid h-12 w-12 place-items-center overflow-hidden rounded-[14px] transition-[filter,opacity] duration-300 ${
                        contact ? "bg-tuile text-white" : "bg-gris-2"
                      } ${!on && !done && !contact ? "opacity-80 saturate-[0.6] group-hover:opacity-100 group-hover:saturate-100" : ""}`}
                    >
                      {c.photo ? <Image src={c.photo} alt="" width={96} height={96} className="h-full w-full object-cover" /> : <Phone className="h-5 w-5" />}
                    </span>
                    {!contact && (
                      <span
                        className={`absolute -left-1.5 -top-1.5 grid h-[22px] w-[22px] place-items-center rounded-full text-[0.6875rem] font-[700] tabular-nums ring-[3px] transition-colors duration-300 ${
                          on ? "ring-white" : "ring-[#f4f4f6]"
                        } ${done ? "bg-tuile text-white" : on ? "bg-encre text-white" : "bg-white text-encre"}`}
                      >
                        {done ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[0.96875rem] font-[640] leading-[1.2] tracking-[-0.015em] transition-colors duration-300 ${on ? "text-encre" : "text-encre/70 group-hover:text-encre"}`}>
                      {c.short}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-[1.3] text-brume">{c.hint}</span>
                    {!contact && (
                      <span className={`mt-2 block h-[3px] overflow-hidden rounded-full bg-gris-2 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden>
                        <span className="block h-full rounded-full bg-tuile transition-[width] duration-150 ease-linear" style={{ width: `${fill * 100}%` }} />
                      </span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="m-3 shrink-0 rounded-[24px] bg-encre p-4 text-white">
        <p className="text-[1rem] font-[640] tracking-[-0.015em]">Un projet ?</p>
        <p className="mt-0.5 text-[0.8125rem] leading-[1.35] text-white/60">Devis gratuit, un technicien vous rappelle sous {site.callbackDelay}.</p>
        <button type="button" className="btn btn-cta btn-sm mt-3.5 w-full" onClick={() => goToQuote({ source: "sommaire" })}>
          Devis gratuit
        </button>
        <a href={`tel:${site.phoneHref}`} className="mt-2.5 flex items-center justify-center gap-2 text-[0.875rem] font-[600] tabular-nums text-white/80 transition-colors hover:text-white">
          <Phone className="h-4 w-4" />
          {site.phone}
        </a>
      </div>
    </aside>
  );
}
