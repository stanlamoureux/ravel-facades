import Image from "next/image";
import { site } from "@/config/site";

const steps = [
  {
    title: "Diagnostic et devis",
    text: `Visite gratuite : on relève les fissures, on sonde l'enduit, on mesure. Vous recevez un devis poste par poste sous ${site.quoteDelay}.`,
    img: { src: "/images/etape-diagnostic.webp", alt: "Un technicien examine une fissure sur un enduit ancien, tablette à la main" },
  },
  {
    title: "Préparation",
    text: "Échafaudage, protection des sols et des menuiseries, puis nettoyage et réparation du support. C'est la moitié du travail.",
    img: { src: "/images/etape-preparation.webp", alt: "Maison entourée d'un échafaudage et de filets de protection, sol bâché" },
  },
  {
    title: "Finition",
    text: "Enduit neuf ou peinture en deux couches, dans la teinte validée avec vous sur un essai réel.",
    img: { src: "/images/etape-finition.webp", alt: "Fenêtre aux volets verts sur un enduit refait" },
  },
  {
    title: "Réception",
    text: "On fait le tour ensemble, chantier nettoyé. Vous ne réglez le solde qu'une fois tout validé.",
    img: { src: "/images/etape-reception.webp", alt: "Un couple et un artisan, de dos, regardent la façade terminée" },
  },
];

export function Journey() {
  return (
    <section id="methode" className="py-14 md:py-32" aria-labelledby="methode-title">
      <div className="wrap">
        <h2 id="methode-title" className="t-h2 max-w-[13ch]">
          Un chantier en quatre temps.
        </h2>
        <p className="t-lede mt-4 max-w-[42ch] md:mt-6">Vous savez à chaque étape ce qui se passe, combien de temps ça dure et ce que ça coûte.</p>

        <ol className="mt-8 grid gap-y-5 md:mt-16 md:grid-cols-4 md:gap-x-5">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[88px_1fr] items-start gap-x-4 md:block">
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-gris md:aspect-[4/3] md:rounded-[24px]">
                <Image src={s.img.src} alt={s.img.alt} fill quality={80} sizes="(min-width: 768px) 280px, 88px" className="object-cover" />
              </div>
              <div className="md:mt-5">
                <p className="text-[0.875rem] font-[600] tabular-nums text-brume">Étape {i + 1}</p>
                <h3 className="mt-0.5 text-[1.1875rem] font-[640] leading-[1.2] tracking-[-0.02em] md:text-[1.375rem]">{s.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.5] text-ardoise md:mt-2 md:text-base">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
