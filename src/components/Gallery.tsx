import Image from "next/image";
import { site } from "@/config/site";

/** Réalisations - DONNÉES TEST, à remplacer par les chantiers du client. */
const works = [
  { src: "/images/realisation-longere.webp", title: "Longère à Milly-la-Forêt", detail: "Enduit à la chaux, teinte sable", alt: "Longère à l'enduit ocre et aux volets vert sauge", wide: true },
  { src: "/images/realisation-meuliere.webp", title: "Meulière à Savigny-sur-Orge", detail: "Nettoyage et rejointoiement", alt: "Maison en meulière aux joints refaits, encadrements en brique" },
  { src: "/images/realisation-contemporaine.webp", title: "Maison à Massy", detail: "Peinture blanc et anthracite", alt: "Maison contemporaine cubique, enduit blanc et volume gris anthracite" },
  { src: "/images/realisation-immeuble.webp", title: "Immeuble à Versailles", detail: "Ravalement pierre et moulures", alt: "Immeuble ancien à la façade ton pierre restaurée, balcons en fer forgé" },
  { src: "/images/realisation-pavillon.webp", title: "Pavillon à Brétigny-sur-Orge", detail: "Peinture grège, volets blancs", alt: "Pavillon repeint en grège avec volets blancs" },
];

export function Gallery() {
  return (
    <section id="realisations" className="pb-4 pt-20 md:pb-8 md:pt-32" aria-labelledby="realisations-title">
      <div className="wrap">
        <h2 id="realisations-title" className="t-h2 max-w-[14ch]">
          Pierre, enduit, brique&nbsp;: à chaque façade sa méthode.
        </h2>
        <p className="t-lede mt-4 max-w-[42ch] md:mt-6">On ne traite pas une meulière comme un pavillon des années 80. Quelques chantiers livrés ces derniers mois.</p>
      </div>

      <ul className="snap-row mt-9 gap-3 px-5 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-12 md:gap-5 md:overflow-visible md:px-8">
        {works.map((w, i) => (
          <li
            key={w.src}
            className={`relative aspect-[3/4] w-[74vw] max-w-[320px] overflow-hidden rounded-[28px] bg-gris md:aspect-auto md:h-[clamp(380px,40vw,520px)] md:w-auto md:max-w-none ${
              w.wide ? "md:col-span-8" : i === 1 ? "md:order-first md:col-span-4" : "md:col-span-4"
            }`}
          >
            <Image src={w.src} alt={w.alt} fill quality={80} sizes={w.wide ? "(min-width: 768px) 760px, 74vw" : "(min-width: 768px) 380px, 74vw"} className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#07131d]/85 via-[#07131d]/35 to-transparent" aria-hidden />
            <p className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
              <span className="block text-[1.125rem] font-[640] leading-[1.2] tracking-[-0.02em] md:text-[1.25rem]">{w.title}</span>
              <span className="mt-1 block text-[0.9375rem] text-white/80">{w.detail}</span>
            </p>
          </li>
        ))}
        <li className="w-2 md:hidden" aria-hidden />
      </ul>
      {site.demo && <p className="wrap mt-6 text-[0.8125rem] text-brume">Réalisations présentées à titre d&apos;exemple.</p>}
    </section>
  );
}
