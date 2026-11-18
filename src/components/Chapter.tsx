import { chapterAnchor, chapters, type ChapterId } from "@/config/chapters";
import { Phone } from "./icons";

/**
 * Un chapitre de la page. Son titre, en pastille, reste collé sous l'en-tête tant qu'on lit
 * ses sections, puis le chapitre suivant le pousse et prend sa place.
 */
export function Chapter({ id, children }: { id: ChapterId; children: React.ReactNode }) {
  const i = chapters.findIndex((c) => c.id === id);
  const c = chapters[i];
  return (
    <section id={chapterAnchor(id)} data-chapter={id} aria-label={c.title} className="relative">
      <div className="pointer-events-none sticky top-16 z-30 h-[52px] md:top-[72px] md:h-[60px]">
        <div className="wrap pt-2.5 md:pt-4">
          <p className="inline-flex h-10 items-center gap-2.5 rounded-full bg-encre/92 pl-1.5 pr-4 text-[0.9375rem] font-[620] tracking-[-0.01em] text-white shadow-[0_8px_24px_-10px_rgb(14_26_38/0.5),inset_0_0_0_1px_rgb(255_255_255/0.12)] backdrop-blur-xl md:h-11 md:text-base">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-[0.8125rem] font-[680] tabular-nums md:h-8 md:w-8 ${id === "contact" ? "bg-tuile text-white" : "bg-white text-encre"}`}>
              {id === "contact" ? <Phone className="h-4 w-4" /> : i + 1}
            </span>
            {c.title}
          </p>
        </div>
      </div>
      {/* le contenu remonte sous la pastille : elle flotte au-dessus sans décaler la mise en page */}
      <div className="-mt-[52px] md:-mt-[60px]">{children}</div>
    </section>
  );
}
