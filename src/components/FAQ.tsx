import { faq } from "@/config/faq";
import { Plus } from "./icons";

export function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id="faq" className="bg-pierre px-5 py-24 md:py-32" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.6fr]">
        <h2 id="faq-title" className="headline text-[clamp(2rem,4.4vw,3.6rem)]">
          Vos questions, nos réponses.
        </h2>
        <div className="divide-y divide-ardoise/10 border-y border-ardoise/10">
          {faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.15rem] font-[580] tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-zinc transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-6 pr-10 text-zinc">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
