import { site } from "@/config/site";

export function Zones() {
  return (
    <section className="px-5 py-24 md:py-32" aria-labelledby="zones-title">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="zones-title" className="headline max-w-[640px] text-[clamp(2rem,4.4vw,3.6rem)]">
            Partout en Île-de-France.
          </h2>
          <p className="max-w-[40ch] text-zinc">
            Votre commune n&apos;apparaît pas ? Appelez le{" "}
            <a className="link whitespace-nowrap" href={`tel:${site.phoneHref}`}>
              {site.phone}
            </a>
            , on se déplace dans toute la région.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {site.zones.map((z) => (
            <li key={z.code} className="border-t border-ligne pt-5">
              <p className="flex items-baseline gap-3">
                <span className="headline text-[2.2rem] tabular-nums leading-none">{z.code}</span>
                <span className="text-[1.15rem] font-[600]">{z.name}</span>
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc">{z.cities.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
