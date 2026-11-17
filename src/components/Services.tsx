"use client";

import { services, type ServiceId } from "@/config/offer";
import { StaticFacade } from "./facade/Facade";
import { useQuote } from "./QuoteContext";
import { IconCrack, IconDrop, IconLayers, IconRoller, IconWall, IconWater } from "./icons";

const icons: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  ravalement: IconWall,
  nettoyage: IconWater,
  peinture: IconRoller,
  hydrofuge: IconDrop,
  fissures: IconCrack,
  ite: IconLayers,
};

const fmt = (n: number) => n.toLocaleString("fr-FR");

export function Services() {
  const { goToQuote } = useQuote();
  const [main, ...rest] = services;
  const MainIcon = icons[main.id];

  return (
    <section id="prestations" className="px-5 pb-24 md:pb-36" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-[760px]">
          <h2 id="services-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
            Du simple nettoyage au ravalement complet.
          </h2>
          <p className="lede mt-4">Une seule équipe, du diagnostic à la dernière couche. Chaque prix est détaillé dans votre devis.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {/* tuile principale */}
          <article className="tile relative flex flex-col md:col-span-4 md:row-span-2">
            <div className="p-7 pb-0 md:p-10 md:pb-0">
              <MainIcon className="h-11 w-11 text-outremer" />
              <h3 className="headline mt-5 text-[clamp(1.7rem,3vw,2.5rem)]">{main.name}</h3>
              <p className="mt-3 max-w-[48ch] text-zinc">{main.description}</p>
              <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-xl font-[620]">
                  Dès {fmt(main.priceFrom)} {main.unit}
                </span>
                <span className="text-zinc">{main.duration} de chantier</span>
              </p>
              <button type="button" className="link mt-4 inline-flex items-center gap-1" onClick={() => goToQuote({ works: [main.short], source: "prestations" })}>
                Demander un devis de ravalement
              </button>
            </div>
            <div className="relative mt-auto flex h-[260px] items-end justify-center px-6 md:h-[300px]">
              <StaticFacade variant="maison" state="after" wallColor="#E8DDC7" accentColor="#4A6070" className="block h-full w-auto" />
            </div>
          </article>

          {rest.map((s) => {
            const Icon = icons[s.id];
            return (
              <article key={s.id} className="tile flex flex-col p-7 md:col-span-2">
                <Icon className="h-10 w-10 text-outremer" />
                <h3 className="headline mt-5 text-[1.45rem]">{s.name}</h3>
                <p className="mt-2 flex-1 text-[0.97rem] text-zinc">{s.description}</p>
                <p className="mt-5 text-[1.05rem] font-[620]">
                  Dès {fmt(s.priceFrom)} {s.unit}
                </p>
                <button type="button" className="link mt-2 self-start text-[0.95rem]" onClick={() => goToQuote({ works: [s.short], source: "prestations" })}>
                  Demander un devis
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
