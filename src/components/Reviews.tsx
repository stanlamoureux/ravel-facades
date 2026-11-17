import { site } from "@/config/site";
import { Star } from "./icons";

function Card({ r }: { r: (typeof site.reviews)[number] }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-[24px] bg-pierre p-6 md:w-[380px]">
      <div className="flex text-[#F5B301]" aria-label="5 étoiles sur 5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[18px] w-[18px]" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed">{r.text}</blockquote>
      <figcaption className="mt-5 text-[0.92rem]">
        <span className="block font-[620]">{r.name}</span>
        <span className="block text-zinc">
          {r.job}, {r.city}
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const list = [...site.reviews, ...site.reviews];
  return (
    <section id="avis" className="overflow-hidden py-24 md:py-36" aria-labelledby="avis-title">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 px-5 md:flex-row md:items-end">
        <div className="max-w-[640px]">
          <h2 id="avis-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
            Ce que les voisins en disent.
          </h2>
          {site.demo && <p className="demo-tag mt-4">Avis d&apos;exemple, à remplacer par les vrais avis Google</p>}
        </div>
        <div className="flex items-center gap-4">
          <p className="headline text-[3.6rem] tabular-nums leading-none">{site.rating.value.toLocaleString("fr-FR")}</p>
          <div>
            <div className="flex text-[#F5B301]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5" />
              ))}
            </div>
            <p className="mt-1 text-zinc">{site.rating.count} avis Google</p>
          </div>
        </div>
      </div>

      <div className="relative mt-12" role="region" aria-label="Avis clients" tabIndex={0}>
        <div className="marquee flex w-max gap-4 px-5">
          {list.map((r, i) => (
            <div key={i} aria-hidden={i >= site.reviews.length}>
              <Card r={r} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white md:w-40" />
      </div>
    </section>
  );
}
