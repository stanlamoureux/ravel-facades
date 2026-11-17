import { site } from "@/config/site";
import { Star } from "./icons";

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`flex gap-0.5 text-[#e8a400] ${className}`} aria-hidden>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-[1.05rem] w-[1.05rem]" />
    ))}
  </span>
);

export function Reviews() {
  const note = String(site.rating.value).replace(".", ",");
  return (
    <section id="avis" className="bg-gris py-14 md:py-32" aria-labelledby="avis-title">
      <div className="wrap md:flex md:items-end md:justify-between md:gap-10">
        <h2 id="avis-title" className="t-h2 max-w-[13ch]">
          Ce sont eux qui en parlent le mieux.
        </h2>
        <p className="mt-6 flex items-center gap-3 md:mt-0 md:pb-2">
          <span className="text-[2.5rem] font-[650] leading-none tracking-[-0.04em] tabular-nums">{note}</span>
          <span>
            <Stars />
            <span className="mt-1 block text-[0.875rem] text-ardoise">sur 5, d&apos;après {site.rating.count} avis</span>
          </span>
        </p>
      </div>

      <ul className="snap-row mt-7 gap-3 px-5 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-5 md:overflow-visible md:px-8">
        {site.reviews.map((r) => (
          <li key={r.name} className="flex w-[84vw] max-w-[360px] flex-col rounded-[24px] bg-white p-6 md:w-auto md:max-w-none md:rounded-[28px] md:p-7">
            <Stars />
            <span className="sr-only">5 étoiles sur 5</span>
            <blockquote className="mt-4 flex-1 text-[1.0625rem] leading-[1.5] tracking-[-0.005em]">{r.text}</blockquote>
            <p className="mt-6 border-t border-trait pt-4 text-[0.9375rem] leading-[1.4]">
              <span className="font-[620]">{r.name}</span>
              <span className="block text-ardoise">
                {r.job}, {r.city}
              </span>
            </p>
          </li>
        ))}
        <li className="w-2 md:hidden" aria-hidden />
      </ul>
      {site.demo && <p className="wrap mt-6 text-[0.8125rem] text-brume">Avis donnés à titre d&apos;exemple, en attendant ceux du client.</p>}
    </section>
  );
}
