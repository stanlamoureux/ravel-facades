import { faq } from "@/config/faq";
import { site } from "@/config/site";
import { Plus } from "./icons";

export function FAQ() {
  return (
    <section id="faq" className="pb-14 md:pb-32" aria-labelledby="faq-title">
      <div className="wrap grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div>
          <h2 id="faq-title" className="t-h2 max-w-[10ch]">
            Les questions qu&apos;on nous pose.
          </h2>
          <p className="t-lede mt-4 max-w-[30ch] md:mt-6">
            Une autre question ? Appelez le{" "}
            <a href={`tel:${site.phoneHref}`} className="whitespace-nowrap font-[600] text-encre tabular-nums">
              {site.phone}
            </a>
            .
          </p>
        </div>
        <div className="border-t border-trait">
          {faq.map((f) => (
            <details key={f.q} className="group border-b border-trait">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[1.0625rem] font-[600] leading-[1.3] tracking-[-0.01em] md:py-6 md:text-[1.1875rem] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gris transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-encre group-open:text-white">
                  <Plus className="h-[1.1rem] w-[1.1rem]" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 pr-10 leading-[1.6] text-ardoise md:text-[1.0625rem]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
