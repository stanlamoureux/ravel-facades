"use client";

import Image from "next/image";
import Link from "next/link";
import { typo } from "@/lib/typo";
import { useQuote } from "./QuoteContext";
import { Arrow, Chevron } from "./icons";

type Photo = { src: string; alt: string; position?: string };
type Item = { label: string; text: string; href: string };

/** Ouverture d'un chapitre : le métier en une phrase, deux photos, les prestations qui en font partie. */
export function ChapterIntro({
  title,
  lede,
  photos,
  items,
  source,
  flip = false,
  children,
}: {
  title: string;
  lede: string;
  photos: [Photo, Photo?];
  items: Item[];
  source: string;
  flip?: boolean;
  children?: React.ReactNode;
}) {
  const { goToQuote } = useQuote();
  const [main, second] = photos;
  return (
    <div className="pb-14 pt-[4.5rem] md:pb-24 md:pt-32">
      <div className={`wrap grid gap-x-14 gap-y-8 lg:grid-cols-2 lg:items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative">
          <div className="relative aspect-[4/3.3] overflow-hidden rounded-[28px] bg-gris md:aspect-[4/3.6] md:rounded-[32px]">
            <Image src={main.src} alt={main.alt} fill quality={85} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" style={{ objectPosition: main.position }} />
          </div>
          {second && (
            <div className="absolute -bottom-6 right-4 aspect-square w-[34%] overflow-hidden rounded-[22px] bg-gris shadow-[0_18px_40px_-16px_rgb(14_26_38/0.55)] ring-4 ring-white md:-bottom-8 md:right-6 md:rounded-[26px]">
              <Image src={second.src} alt={second.alt} fill quality={80} sizes="(min-width: 1024px) 200px, 34vw" className="object-cover" style={{ objectPosition: second.position }} />
            </div>
          )}
        </div>

        <div className={second ? "pt-4 lg:pt-0" : ""}>
          <h2 className="t-display text-[clamp(2.25rem,9vw,4rem)]">{title}</h2>
          <p className="t-lede mt-4 max-w-[42ch] md:mt-6">{typo(lede)}</p>
          <ul className="mt-6 border-t border-trait md:mt-8">
            {items.map((it) => (
              <li key={it.label} className="border-b border-trait">
                <Link href={it.href} className="group flex items-center justify-between gap-4 py-3.5 md:py-4">
                  <span>
                    <span className="block text-[1.0625rem] font-[620] tracking-[-0.015em] md:text-[1.125rem]">{it.label}</span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-[1.4] text-ardoise">{typo(it.text)}</span>
                  </span>
                  <Chevron className="h-5 w-5 shrink-0 text-brume transition-transform duration-300 group-hover:translate-x-1 group-hover:text-encre" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:gap-3">
            <button type="button" className="btn btn-cta !px-3 md:!px-6" onClick={() => goToQuote({ works: [title], source })}>
              Devis gratuit
            </button>
            <Link href={items[0].href} className="btn btn-soft !px-3 md:!px-6">
              En savoir plus
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
