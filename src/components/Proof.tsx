import Image from "next/image";
import { site } from "@/config/site";
import { nombre } from "@/lib/format";

/** L'entreprise en une phrase, l'équipe en photo, puis les trois labels. */
export function Proof() {
  const [done, , recommend] = site.stats;
  return (
    <section className="py-14 md:py-32" aria-label="L'entreprise en bref">
      <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div>
          <p className="max-w-[22ch] text-[clamp(1.75rem,7.2vw,3rem)] font-[620] leading-[1.1] tracking-[-0.03em] text-balance">
            Depuis {site.foundedYear}, nous avons rénové {nombre(done.value)} façades en Île-de-France. {recommend.value}&nbsp;% de nos clients nous recommandent.
          </p>
          <dl className="mt-7 border-t border-trait md:mt-14">
            {site.certifications.map((c) => (
              <div key={c.name} className="flex items-baseline justify-between gap-6 border-b border-trait py-4">
                <dt className="text-[1.0625rem] font-[640] tracking-[-0.01em] md:text-[1.125rem]">{c.name}</dt>
                <dd className="text-right text-[0.9375rem] text-ardoise md:text-base">{c.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="-order-1 lg:order-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-gris lg:aspect-[5/5.4] lg:rounded-[36px]">
            <Image src="/images/equipe.webp" alt="Trois façadiers en tenue de travail bleu marine devant leur camionnette" fill quality={80} sizes="(min-width: 1024px) 540px, 100vw" className="object-cover object-[78%_50%]" />
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-ardoise">{site.teamCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
