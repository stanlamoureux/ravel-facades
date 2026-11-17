import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callback } from "@/components/Callback";
import { Compare } from "@/components/Compare";
import { Footer } from "@/components/Footer";
import { MobileBar, Nav } from "@/components/Nav";
import { Arrow, Check, Chevron, Clock, Phone, Plus, Shield, Star } from "@/components/icons";
import { extras, ficheHref, fiches } from "@/config/fiches";
import { services } from "@/config/offer";
import { site } from "@/config/site";
import { typo } from "@/lib/typo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: fiches[s.id].slug }));
}

const find = (slug: string) => services.find((s) => fiches[s.id].slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = find(slug);
  if (!service) return {};
  const f = fiches[service.id];
  return {
    title: `${f.title} en Essonne`,
    description: f.lede,
    alternates: { canonical: `/prestations/${f.slug}` },
    openGraph: { title: `${f.title} - ${site.name}`, description: f.lede, images: [{ url: "/images/partage.jpg", width: 1200, height: 630 }] },
  };
}

/** Fiche prestation : la photo, le résultat, ce qui est compris, le déroulé, puis l'essentiel, se parler. */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const service = find(slug);
  if (!service) notFound();
  const f = fiches[service.id];
  const x = extras[service.id];
  const review = site.reviews.find((r) => r.name === x.review);
  const others = services.filter((s) => s.id !== service.id);
  const tel = `tel:${site.phoneHref}`;
  const shot = (n: string, when: string) => ({ src: `/images/${n}.webp`, alt: `${x.compare.caption}, ${when}` });

  return (
    <>
      <Nav solid />
      <main className="pt-16 md:pt-[72px]">
        {/* En-tête : la photo en grand, le titre posé dessus sur mobile */}
        <section className="md:wrap md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-12 md:pb-16 md:pt-10 lg:gap-16">
          <div className="relative h-[min(58svh,460px)] overflow-hidden bg-gris md:order-2 md:aspect-[4/4.6] md:h-auto md:rounded-[36px]">
            <Image src={f.photo.src} alt={f.photo.alt} fill priority quality={85} sizes="(min-width: 768px) 560px, 100vw" className="object-cover" style={{ objectPosition: f.photo.position }} />
            <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#07131d]/85 via-[#07131d]/35 to-transparent md:hidden" aria-hidden />
            <Link href="/#prestations" className="glass absolute left-4 top-4 inline-flex h-9 items-center gap-1 rounded-full pl-2.5 pr-3.5 text-[0.875rem] font-[560] text-white md:hidden">
              <Chevron className="h-4 w-4 rotate-180" />
              Prestations
            </Link>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white md:hidden">
              <h1 className="t-display text-[clamp(2.1rem,9.6vw,2.75rem)]">{f.title}</h1>
              <ul className="mt-3 flex flex-wrap gap-1.5 text-[0.8125rem] font-[560]">
                {f.facts.map(([k, v]) => (
                  <li key={k} className="glass rounded-full px-3 py-1">
                    {k === "Durée du chantier" ? v : `${k} : ${v.toLowerCase()}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="wrap pt-6 md:order-1 md:w-auto md:max-w-none md:px-0 md:pt-0">
            <Link href="/#prestations" className="-ml-1 hidden h-11 items-center gap-1 text-[0.9375rem] font-[540] text-ardoise transition-colors hover:text-encre md:inline-flex">
              <Chevron className="h-[1.1rem] w-[1.1rem] rotate-180" />
              Toutes les prestations
            </Link>
            <h1 className="t-display mt-3 hidden text-[clamp(2.75rem,5vw,4.5rem)] md:block">{f.title}</h1>
            <p className="t-lede max-w-[40ch] md:mt-6">{typo(f.lede)}</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-9 md:flex md:flex-wrap md:gap-3">
              <a href="#rappel" className="btn btn-cta !px-3 md:h-14 md:!px-7 md:text-[1.0625rem]">
                Être rappelé
              </a>
              <a href={tel} className="btn btn-ink !px-3 tabular-nums md:h-14 md:!px-6 md:text-[1.0625rem]">
                <Phone className="h-5 w-5" />
                <span className="md:hidden">Appeler</span>
                <span className="hidden md:inline">{site.phone}</span>
              </a>
            </div>
            <dl className="mt-10 hidden grid-cols-3 gap-6 border-t border-trait pt-6 md:grid">
              {f.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.875rem] text-ardoise">{k}</dt>
                  <dd className="mt-1 text-[1.1875rem] font-[640] tracking-[-0.02em]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Le résultat, sur un vrai chantier */}
        <section className="bg-encre py-12 text-white md:py-24" aria-labelledby="resultat-title">
          <div className="wrap grid gap-x-16 gap-y-6 md:gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <h2 id="resultat-title" className="t-h2 max-w-[12ch]">
                Le résultat, sur un chantier.
              </h2>
              <p className="t-lede mt-3 max-w-[36ch] !text-white/65 md:mt-5">{x.compare.caption}.</p>
            </div>
            <Compare
              before={shot(x.compare.before, "avant travaux")}
              after={shot(x.compare.after, "après travaux")}
              position={x.compare.position}
              className="-mx-5 aspect-[10/8] md:mx-0 md:aspect-[16/11] md:rounded-[28px]"
            />
          </div>
        </section>

        {/* Ce qui est compris + quand y penser */}
        <section className="wrap grid gap-x-16 gap-y-10 py-12 md:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h2 className="t-h2">Ce qui est compris.</h2>
            <ul className="mt-5 grid gap-x-8 md:mt-9 md:grid-cols-2">
              {f.includes.map((it) => (
                <li key={it} className="flex items-start gap-3 border-b border-trait py-3 leading-[1.4] md:py-4 md:text-[1.0625rem]">
                  <span className="mt-0.5 grid h-[1.375rem] w-[1.375rem] shrink-0 place-items-center rounded-full bg-volet text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {typo(it)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] bg-gris p-5 md:rounded-[28px] md:p-8">
            <h2 className="t-h3">C&apos;est le moment d&apos;y penser si</h2>
            <ul className="mt-4 space-y-3">
              {f.signs.map((it) => (
                <li key={it} className="flex gap-3 leading-[1.4]">
                  <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-tuile" aria-hidden />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Le déroulé : c'est une suite d'étapes, d'où la numérotation */}
        <section className="pb-12 md:pb-24" aria-labelledby="deroule-title">
          <div className="wrap">
            <h2 id="deroule-title" className="t-h2">
              Comment ça se passe.
            </h2>
          </div>
          <ol className="snap-row mt-6 gap-3 px-5 md:mx-auto md:mt-10 md:grid md:max-w-[1200px] md:grid-cols-4 md:gap-5 md:overflow-visible md:px-8">
            {x.steps.map(([t, d], i) => (
              <li key={t} className="w-[64vw] max-w-[260px] rounded-[22px] bg-gris p-5 md:w-auto md:max-w-none md:rounded-[26px] md:p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-encre text-[0.9375rem] font-[640] tabular-nums text-white">{i + 1}</span>
                <h3 className="mt-4 text-[1.125rem] font-[640] tracking-[-0.02em]">{t}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.45] text-ardoise">{typo(d)}</p>
              </li>
            ))}
            <li className="w-2 md:hidden" aria-hidden />
          </ol>
        </section>

        {review && (
          <section className="wrap pb-12 md:pb-24" aria-label="Avis client">
            <figure className="rounded-[24px] border border-trait p-6 md:rounded-[32px] md:p-12">
              <span className="flex gap-0.5 text-[#e8a400]" aria-label="5 étoiles sur 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-[1.05rem] w-[1.05rem]" />
                ))}
              </span>
              <blockquote className="mt-4 max-w-[46ch] text-[1.1875rem] font-[540] leading-[1.45] tracking-[-0.015em] md:text-[1.625rem] md:leading-[1.35]">
                {review.text}
              </blockquote>
              <figcaption className="mt-5 text-[0.9375rem] text-ardoise">
                <span className="font-[620] text-encre">{review.name}</span>, {review.job.toLowerCase()} à {review.city}
              </figcaption>
            </figure>
          </section>
        )}

        <section id="rappel" className="bg-encre py-12 text-white md:py-28" aria-labelledby="rappel-title">
          <div className="wrap grid gap-x-16 gap-y-7 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="rappel-title" className="t-h2 max-w-[11ch]">
                Parlons de votre projet.
              </h2>
              <p className="t-lede mt-3 max-w-[36ch] !text-white/70 md:mt-6">
                Laissez votre numéro&nbsp;: un technicien vous rappelle sous {site.callbackDelay} pour comprendre votre façade et convenir d&apos;une visite gratuite.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-white/80 md:mt-9 md:block md:space-y-3 md:text-base">
                <li className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 shrink-0 text-white/55" />
                  Dix minutes au téléphone
                </li>
                <li className="flex items-center gap-2.5">
                  <Shield className="h-5 w-5 shrink-0 text-white/55" />
                  Un technicien, pas un centre d&apos;appels
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-5 w-5 shrink-0 text-white/55" />
                  Sans engagement
                </li>
              </ul>
              <a href={tel} className="mt-10 hidden items-center gap-4 lg:flex">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-encre">
                  <Phone className="h-[1.35rem] w-[1.35rem]" />
                </span>
                <span>
                  <span className="block text-[0.9375rem] text-white/60">Ou appelez directement</span>
                  <span className="block text-[1.625rem] font-[650] leading-tight tracking-[-0.03em] tabular-nums">{site.phone}</span>
                </span>
              </a>
            </div>
            <div>
              <Callback service={service.name} source={`fiche-${service.id}`} />
              <p className="mt-4 text-center text-[0.9375rem] text-white/70 lg:hidden">
                Ou appelez directement le{" "}
                <a href={tel} className="whitespace-nowrap font-[640] tabular-nums text-white underline underline-offset-4">
                  {site.phone}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="wrap grid gap-x-16 gap-y-6 py-12 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" aria-labelledby="questions-title">
          <h2 id="questions-title" className="t-h2 max-w-[10ch]">
            Vos questions.
          </h2>
          <div className="border-t border-trait">
            {x.faq.map(([q, a]) => (
              <details key={q} className="group border-b border-trait">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-[600] leading-[1.3] tracking-[-0.01em] md:py-5 md:text-[1.1875rem] [&::-webkit-details-marker]:hidden">
                  {typo(q)}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gris transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-encre group-open:text-white">
                    <Plus className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-5 pr-10 leading-[1.6] text-ardoise">{typo(a)}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pb-14 md:pb-24" aria-labelledby="autres-title">
          <div className="wrap">
            <Link href="/#simulateur" className="group flex items-center justify-between gap-5 rounded-[24px] bg-gris p-5 transition-colors hover:bg-gris-2 md:rounded-[28px] md:p-8">
              <span>
                <span className="block text-[1.125rem] font-[640] leading-[1.2] tracking-[-0.02em] md:text-[1.5rem]">Envie d&apos;un ordre de prix d&apos;abord&nbsp;?</span>
                <span className="mt-1 block text-ardoise">Faire une estimation en 30 secondes</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-encre text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <Arrow className="h-5 w-5" />
              </span>
            </Link>
            <h2 id="autres-title" className="t-h3 mt-12 md:mt-20">
              Les autres prestations
            </h2>
          </div>
          <ul className="snap-row mt-5 gap-3 px-5 md:mx-auto md:mt-8 md:grid md:max-w-[1200px] md:grid-cols-5 md:gap-4 md:overflow-visible md:px-8">
            {others.map((s) => {
              const o = fiches[s.id];
              return (
                <li key={s.id} className="w-[44vw] max-w-[200px] md:w-auto md:max-w-none">
                  <Link href={ficheHref(s.id)} className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-gris text-white">
                    <Image src={o.photo.src} alt="" fill quality={75} sizes="(min-width: 768px) 220px, 44vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" style={{ objectPosition: o.photo.position }} />
                    <span className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#07131d]/85 to-transparent" aria-hidden />
                    <span className="absolute inset-x-0 bottom-0 p-3.5 text-[0.9375rem] font-[620] leading-[1.2] tracking-[-0.01em]">{s.name}</span>
                  </Link>
                </li>
              );
            })}
            <li className="w-2 md:hidden" aria-hidden />
          </ul>
        </section>
      </main>
      <Footer />
      <MobileBar primary={{ label: "Être rappelé", href: "#rappel" }} />
    </>
  );
}
