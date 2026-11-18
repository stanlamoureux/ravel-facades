"use client";

import { useEffect, useState } from "react";
import { chapterAnchor, chapters } from "@/config/chapters";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Logo } from "./Nav";
import { Phone } from "./icons";

/**
 * Sommaire fixe à gauche, sur grand écran : les quatre métiers puis le contact.
 * Le trait qui relie les chapitres se remplit au fil de la lecture.
 */
export function Rail() {
  const [progress, setProgress] = useState(-1); // -1 : avant le premier chapitre ; 1.5 : moitié du chapitre 2
  const { goToQuote } = useQuote();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let p = -1;
      chapters.forEach((c, i) => {
        const el = document.getElementById(chapterAnchor(c.id));
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= line) p = i + Math.min(1, Math.max(0, (line - r.top) / r.height));
      });
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = progress < 0 ? -1 : Math.min(chapters.length - 1, Math.floor(progress));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-trait bg-white lg:flex" aria-label="Sommaire">
      <a href="#top" className="flex h-[72px] shrink-0 items-center px-7" aria-label={`${site.name}, retour en haut de page`}>
        <Logo />
      </a>

      <nav className="flex flex-1 flex-col justify-center px-5" aria-label="Chapitres">
        <ol>
          {chapters.map((c, i) => {
            const on = i === active;
            const done = i < active;
            const fill = Math.min(1, Math.max(0, progress - i));
            const last = i === chapters.length - 1;
            return (
              <li key={c.id} className="relative">
                {!last && (
                  <span className="absolute left-[17px] top-[44px] h-[calc(100%-36px)] w-[2px] overflow-hidden rounded-full bg-gris-2" aria-hidden>
                    <span className="absolute inset-x-0 top-0 bg-tuile transition-[height] duration-150 ease-linear" style={{ height: `${fill * 100}%` }} />
                  </span>
                )}
                <a
                  href={`#${chapterAnchor(c.id)}`}
                  aria-current={on ? "location" : undefined}
                  className="group flex items-start gap-3.5 rounded-[18px] px-0.5 py-2.5 transition-colors"
                >
                  <span
                    className={`relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.875rem] font-[660] tabular-nums transition-[background-color,color,box-shadow] duration-300 ${
                      on
                        ? last
                          ? "bg-tuile text-white shadow-[0_6px_16px_-6px_rgb(200_69_28/0.8)]"
                          : "bg-encre text-white shadow-[0_6px_16px_-6px_rgb(14_26_38/0.6)]"
                        : done
                          ? "bg-tuile/12 text-tuile"
                          : "bg-white text-brume shadow-[inset_0_0_0_1.5px_var(--color-trait)] group-hover:text-encre group-hover:shadow-[inset_0_0_0_1.5px_var(--color-brume)]"
                    }`}
                  >
                    {last ? <Phone className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="min-w-0 pb-5 pt-1.5">
                    <span className={`block text-[1rem] font-[640] leading-[1.15] tracking-[-0.015em] transition-colors duration-300 ${on ? "text-encre" : "text-encre/55 group-hover:text-encre"}`}>{c.title}</span>
                    <span className={`mt-1 block text-[0.8125rem] leading-[1.3] transition-colors duration-300 ${on ? "text-ardoise" : "text-brume"}`}>{c.hint}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="shrink-0 space-y-2.5 border-t border-trait p-5">
        <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2.5 px-1 text-[0.9375rem] font-[640] tabular-nums">
          <Phone className="h-[1.1rem] w-[1.1rem]" />
          {site.phone}
        </a>
        <button type="button" className="btn btn-cta w-full" onClick={() => goToQuote({ source: "sommaire" })}>
          Devis gratuit
        </button>
      </div>
    </aside>
  );
}
