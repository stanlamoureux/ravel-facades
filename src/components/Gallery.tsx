import Image from "next/image";

/** Réalisations : vraies photos de chantiers de Steevy Grand. */
const works = [
  { src: "/images/vrai-realisation-pavillon-blanc.webp", title: "Pavillon et terrasse", detail: "Ravalement, enduit blanc", alt: "Pavillon à l'enduit blanc refait, vu depuis le jardin", wide: true },
  { src: "/images/vrai-realisation-volets-bois.webp", title: "Maison aux volets bois", detail: "Façade blanche, volets conservés", alt: "Maison à la façade blanche et aux volets en bois" },
  { src: "/images/vrai-chantier-peinture.webp", title: "Pignon en cours", detail: "Préparation avant peinture", alt: "Peintre sur une échelle, pignon préparé avant la mise en teinte" },
  { src: "/images/vrai-chantier-echafaudage.webp", title: "Pignon sous échafaudage", detail: "Enduit neuf", alt: "Pignon de maison sous échafaudage, enduit neuf" },
  { src: "/images/vrai-realisation-pavillon-blanc-2.webp", title: "Le même pavillon", detail: "Côté terrasse", alt: "Pavillon blanc au toit sombre, côté terrasse" },
];

export function Gallery() {
  return (
    <section id="realisations" className="pb-4 pt-14 md:pb-8 md:pt-[min(8rem,12svh)]" aria-labelledby="realisations-title">
      <div className="wrap">
        <h2 id="realisations-title" className="t-h2 max-w-[14ch]">
          Quelques chantiers de Steevy.
        </h2>
        <p className="t-lede mt-4 max-w-[42ch] md:mt-6">Des photos prises sur place, pendant et après les travaux.</p>
      </div>

      <ul className="snap-row mt-7 gap-3 px-5 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-12 md:gap-5 md:overflow-visible md:px-8">
        {works.map((w, i) => (
          <li
            key={w.src}
            className={`relative aspect-[3/4] w-[74vw] max-w-[320px] overflow-hidden rounded-[28px] bg-gris md:aspect-auto md:h-[min(clamp(340px,36vw,480px),46svh)] md:w-auto md:max-w-none ${
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
    </section>
  );
}
