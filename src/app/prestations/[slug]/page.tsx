import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callback } from "@/components/Callback";
import { Footer } from "@/components/Footer";
import { MobileBar, Nav } from "@/components/Nav";
import { Arrow, Check, Chevron, Clock, Phone, Shield } from "@/components/icons";
import { ficheHref, fiches } from "@/config/fiches";
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

/** Fiche prestation : ce qu'on fait, ce qui est compris, puis l'essentiel, se parler. */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const service = find(slug);
  if (!service) notFound();
  const f = fiches[service.id];
  const others = services.filter((s) => s.id !== service.id);
  const tel = `tel:${site.phoneHref}`;

  return (
    <>
      <Nav solid />
      <main className="pt-16 md:pt-[72px]">
        <section className="wrap grid gap-x-14 gap-y-9 pb-12 pt-4 md:pb-20 md:pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <Link href="/#prestations" className="-ml-1 inline-flex h-11 items-center gap-1 text-[0.9375rem] font-[540] text-ardoise transition-colors hover:text-encre">
              <Chevron className="h-[1.1rem] w-[1.1rem] rotate-180" />
              Toutes les prestations
            </Link>
            <h1 className="t-display mt-2 text-[clamp(2.1rem,9.4vw,4.5rem)] md:mt-4">{f.title}</h1>
            <p className="t-lede mt-4 max-w-[38ch] md:mt-6">{typo(f.lede)}</p>
            <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap md:mt-9 md:gap-3">
              <a href="#rappel" className="btn btn-cta md:h-14 md:px-7 md:text-[1.0625rem]">
                Être rappelé sous {site.callbackDelay}
              </a>
              <a href={tel} className="btn btn-ink tabular-nums md:h-14 md:px-6 md:text-[1.0625rem]">
                <Phone className="h-5 w-5" />
                {site.phone}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] bg-gris lg:aspect-[4/4.5] lg:rounded-[36px]">
            <Image src={f.photo.src} alt={f.photo.alt} fill priority quality={85} sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" style={{ objectPosition: f.photo.position }} />
          </div>
        </section>

        <section className="wrap" aria-label="En bref">
          <dl className="border-t border-trait md:grid md:grid-cols-3 md:gap-x-10 md:border-y md:py-8">
            {f.facts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-trait py-4 md:block md:border-0 md:py-0">
                <dt className="text-[0.9375rem] text-ardoise">{k}</dt>
                <dd className="text-right text-[1.0625rem] font-[640] tracking-[-0.015em] md:mt-1 md:text-left md:text-[1.5rem] md:tracking-[-0.025em]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap grid gap-x-16 gap-y-14 py-16 md:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h2 className="t-h2">Ce qui est compris.</h2>
            <ul className="mt-7 border-t border-trait md:mt-10">
              {f.includes.map((x) => (
                <li key={x} className="flex items-start gap-3.5 border-b border-trait py-4 text-[1.0625rem] leading-[1.4]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-volet text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {typo(x)}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pt-4">
            <h2 className="t-h3">C&apos;est le moment d&apos;y penser si</h2>
            <ul className="mt-5 space-y-2.5">
              {f.signs.map((x) => (
                <li key={x} className="rounded-[18px] bg-gris px-5 py-4 leading-[1.4]">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="rappel" className="bg-encre py-16 text-white md:py-28" aria-labelledby="rappel-title">
          <div className="wrap grid gap-x-16 gap-y-9 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="rappel-title" className="t-h2 max-w-[11ch]">
                Parlons de votre projet.
              </h2>
              <p className="t-lede mt-4 max-w-[36ch] !text-white/70 md:mt-6">
                Laissez votre numéro&nbsp;: un technicien vous rappelle sous {site.callbackDelay} pour comprendre votre façade et convenir d&apos;une visite gratuite.
              </p>
              <ul className="mt-7 space-y-3 text-white/85 md:mt-9">
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-white/55" />
                  Dix minutes au téléphone suffisent
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 shrink-0 text-white/55" />
                  Un technicien, pas un centre d&apos;appels
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-white/55" />
                  Gratuit et sans engagement
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
              <p className="mt-5 text-center text-[0.9375rem] text-white/70 lg:hidden">
                Ou appelez directement le{" "}
                <a href={tel} className="whitespace-nowrap font-[640] tabular-nums text-white underline underline-offset-4">
                  {site.phone}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="wrap py-16 md:py-24">
          <Link href="/#simulateur" className="group flex items-center justify-between gap-5 rounded-[24px] bg-gris p-5 transition-colors hover:bg-gris-2 md:rounded-[28px] md:p-8">
            <span>
              <span className="block text-[1.1875rem] font-[640] leading-[1.2] tracking-[-0.02em] md:text-[1.5rem]">Envie d&apos;un ordre de prix d&apos;abord&nbsp;?</span>
              <span className="mt-1 block text-ardoise">Faire une estimation en 30 secondes</span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-encre text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <Arrow className="h-5 w-5" />
            </span>
          </Link>

          <h2 className="t-label mt-14 text-ardoise md:mt-20">Les autres prestations</h2>
          <ul className="mt-3 border-t border-trait">
            {others.map((s) => (
              <li key={s.id} className="border-b border-trait">
                <Link href={ficheHref(s.id)} className="group flex items-center justify-between gap-4 py-4 md:py-5">
                  <span className="text-[1.0625rem] font-[620] tracking-[-0.015em] md:text-[1.25rem]">{s.name}</span>
                  <Chevron className="h-5 w-5 shrink-0 text-brume transition-transform duration-300 group-hover:translate-x-1 group-hover:text-encre" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <MobileBar primary={{ label: "Être rappelé", href: "#rappel" }} />
    </>
  );
}
