"use client";

import Image from "next/image";
import { chapterAnchor, chapters, type ChapterId } from "@/config/chapters";
import { useReadingProgress } from "@/lib/useProgress";
import { useQuote } from "./QuoteContext";
import { Arrow, Phone } from "./icons";

/**
 * Un chapitre de la page. Son titre, dans une barre, reste collé sous l'en-tête tant qu'on lit
 * ses sections, puis le chapitre suivant le pousse et prend sa place. Un filet suit la lecture
 * du chapitre, et le bouton ouvre la demande de devis avec le métier déjà coché.
 */
export function Chapter({ id, children }: { id: ChapterId; children: React.ReactNode }) {
  const i = chapters.findIndex((c) => c.id === id);
  const c = chapters[i];
  const progress = useReadingProgress();
  const fill = Math.min(1, Math.max(0, progress - i));
  const { goToQuote } = useQuote();
  const contact = c.photo === null;

  return (
    <section id={chapterAnchor(id)} data-chapter={id} aria-label={c.title} className="relative">
      <div className="sticky top-16 z-30 h-14 md:top-[72px] md:h-[60px]">
        <div className="relative h-full border-b border-encre/[0.07] bg-white/[0.88] backdrop-blur-xl backdrop-saturate-150">
          <div className="wrap flex h-full items-center justify-between gap-3">
            <a href={`#${chapterAnchor(id)}`} className="flex min-w-0 items-center gap-2.5" aria-label={`Haut du chapitre ${c.title}`}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full ${contact ? "bg-tuile text-white" : "bg-gris-2"}`}>
                {c.photo ? <Image src={c.photo} alt="" width={64} height={64} className="h-full w-full object-cover" /> : <Phone className="h-4 w-4" />}
              </span>
              <span className="flex min-w-0 items-baseline gap-2 whitespace-nowrap">
                {!contact && <span className="text-[0.8125rem] font-[620] tabular-nums text-brume">0{i + 1}</span>}
                <span className="truncate text-[1.0625rem] font-[650] tracking-[-0.02em] md:text-[1.1875rem]">
                  <span className="sm:hidden">{c.short}</span>
                  <span className="hidden sm:inline">{c.title}</span>
                </span>
                {!contact && <span className="hidden truncate text-[0.875rem] text-ardoise md:inline">{c.hint}</span>}
              </span>
            </a>
            <button
              type="button"
              onClick={() => goToQuote(c.work ? { works: [c.work], source: `pastille-${id}` } : { source: "pastille-contact" })}
              className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-tuile pl-4 pr-3.5 text-[0.875rem] font-[620] text-white shadow-[0_6px_16px_-8px_rgb(200_69_28/0.9)] transition-[background-color,transform] duration-200 hover:bg-tuile-2 active:scale-[0.97]"
            >
              {contact ? "Devis gratuit" : "Devis"}
              <Arrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
          {/* l'avancement dans le chapitre, en filet le long du bord */}
          <span className="absolute inset-x-0 bottom-0 h-[2px]" aria-hidden>
            <span className="block h-full bg-tuile transition-[width] duration-150 ease-linear" style={{ width: `${fill * 100}%` }} />
          </span>
        </div>
      </div>
      {/* le contenu remonte sous la pastille : elle flotte au-dessus sans décaler la mise en page */}
      <div className="-mt-14 md:-mt-[60px]">{children}</div>
    </section>
  );
}
