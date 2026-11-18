import Image from "next/image";
import { site } from "@/config/site";
import { services } from "@/config/offer";
import { QuoteProvider } from "@/components/QuoteContext";
import { Nav, MobileBar } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Proof } from "@/components/Proof";
import { Chapter } from "@/components/Chapter";
import { ChapterIntro } from "@/components/ChapterIntro";
import { Compare } from "@/components/Compare";
import { Rail } from "@/components/Rail";
import { ficheHref } from "@/config/fiches";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Gallery } from "@/components/Gallery";
import { Nuancier } from "@/components/Nuancier";
import { Simulator } from "@/components/Simulator";
import { Journey } from "@/components/Journey";
import { Reviews } from "@/components/Reviews";
import { Zones } from "@/components/Zones";
import { FAQ } from "@/components/FAQ";
import { QuoteSection } from "@/components/QuoteForm";
import { Footer } from "@/components/Footer";

/** "<" écrit sous sa forme échappée JSON, pour qu'aucune balise ne puisse se fermer dans le script. */
const LT = String.fromCharCode(92) + "u003c";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.legalName,
    url: site.url,
    telephone: site.phoneHref,
    email: site.email,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: "FR",
    },
    areaServed: site.zones.map((z) => ({ "@type": "AdministrativeArea", name: z.name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travaux de façade",
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.description } })),
    },
    // la note n'est publiée dans les données structurées qu'avec de vrais avis
    ...(site.demo ? {} : { aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count } }),
  };

  return (
    <QuoteProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, LT) }} />
      <a href="#devis" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Aller au formulaire de devis
      </a>
      <Nav />
      <Rail />
      <div className="lg:pl-[260px]">
        <main>
          <Hero />
          <Proof />

          <Chapter id="ravalement">
            <ChapterIntro
              title="Ravalement de façade"
              lede="On reprend l'enduit, on traite les fissures et on termine par une finition neuve. Votre façade repart pour quinze à vingt ans, isolée si vous le souhaitez."
              photos={[
                { src: "/images/service-ravalement.webp", alt: "Un façadier étale un enduit neuf à la taloche", position: "50% 30%" },
                { src: "/images/etape-preparation.webp", alt: "Maison sous échafaudage, protégée par des filets" },
              ]}
              items={[
                { label: "Ravalement complet", text: "Piquage, reprise de l'enduit, finition neuve", href: ficheHref("ravalement") },
                { label: "Traitement des fissures", text: "Ouvertes, pontées, rebouchées, invisibles", href: ficheHref("fissures") },
                { label: "Isolation par l'extérieur", text: "Isolant et enduit neuf en une opération", href: ficheHref("ite") },
              ]}
              source="chapitre-ravalement"
            />
            <BeforeAfter />
            <Journey />
          </Chapter>

          <Chapter id="peinture">
            <ChapterIntro
              flip
              title="Peinture intérieure et extérieure"
              lede="Façade, volets, séjour ou cage d'escalier : une préparation soignée et deux couches de finition. La teinte se choisit sur votre mur, pas sur un nuancier en papier."
              photos={[
                { src: "/images/interieur-peintre.webp", alt: "Un peintre passe au rouleau un blanc cassé sur le mur d'un séjour" },
                { src: "/images/service-peinture.webp", alt: "Un peintre repeint une façade ocre au rouleau", position: "50% 35%" },
              ]}
              items={[
                { label: "Peinture de façade", text: "Minérale ou pliolite, plus de 80 teintes", href: ficheHref("peinture") },
                { label: "Peinture intérieure", text: "Pièces de vie, plafonds, cages d'escalier", href: ficheHref("peinture") },
                { label: "Volets et boiseries", text: "Décapés, poncés, repeints", href: ficheHref("peinture") },
              ]}
              source="chapitre-peinture"
            />
            <Nuancier />
            <Gallery />
          </Chapter>

          <Chapter id="nettoyage">
            <ChapterIntro
              title="Nettoyage de façade"
              lede="Coulures noires, pollution, mousses et lichens : on lave à basse pression avec le produit adapté à votre support, puis on protège pour que ça dure."
              photos={[
                { src: "/images/service-nettoyage.webp", alt: "Nettoyage d'un enduit à la lance, la partie lavée est nettement plus claire" },
                { src: "/images/prestation-hydrofuge.webp", alt: "Gouttes d'eau qui perlent sur un enduit traité" },
              ]}
              items={[
                { label: "Nettoyage et démoussage", text: "Basse pression, sans abîmer l'enduit", href: ficheHref("nettoyage") },
                { label: "Imperméabilisation hydrofuge", text: "L'eau perle, le mur respire", href: ficheHref("hydrofuge") },
              ]}
              source="chapitre-nettoyage"
            />
            <div className="wrap pb-14 md:pb-24">
              <Compare
                before={{ src: "/images/bourg-avant.webp", alt: "Maison de bourg avant nettoyage, enduit couvert de mousse" }}
                after={{ src: "/images/bourg-apres.webp", alt: "La même maison après nettoyage, enduit beige clair" }}
                position="50% 60%"
                className="aspect-[4/3.4] rounded-[28px] md:aspect-[16/8] md:rounded-[32px]"
              />
              <p className="mt-3 text-[0.875rem] text-ardoise">Maison de bourg à Étampes, nettoyage et hydrofuge en quatre jours.</p>
            </div>
          </Chapter>

          <Chapter id="couverture">
            <ChapterIntro
              flip
              title="Couverture"
              lede="Un toit qui fuit finit toujours par abîmer la façade. Tuiles, mousses, gouttières : on répare, on traite ou on refait, avec la même équipe que pour vos murs."
              photos={[
                { src: "/images/toiture-couvreur.webp", alt: "Un couvreur pose des tuiles neuves en terre cuite", position: "50% 40%" },
                { src: "/images/toiture-gouttiere.webp", alt: "Gouttière en zinc neuve sous des tuiles en terre cuite" },
              ]}
              items={[
                { label: "Réfection de toiture", text: "Écran, liteaux et tuiles neuves", href: ficheHref("couverture") },
                { label: "Réparation et démoussage", text: "Tuiles remplacées, toiture traitée", href: ficheHref("couverture") },
                { label: "Gouttières et zinguerie", text: "Descentes, faîtage, solins", href: ficheHref("couverture") },
              ]}
              source="chapitre-couverture"
            />
            <div className="wrap pb-14 md:pb-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-gris md:aspect-[16/7] md:rounded-[32px]">
                <Image src="/images/toiture-maison.webp" alt="Pavillon de l'Essonne à la toiture en tuiles neuves" fill quality={85} sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
              </div>
              <p className="mt-3 text-[0.875rem] text-ardoise">Toiture et zinguerie refaites sur une maison de l&apos;Essonne.</p>
            </div>
          </Chapter>

          <Chapter id="contact">
            <QuoteSection />
            <Reviews />
            <Zones />
            <FAQ />
            <Simulator />
          </Chapter>
        </main>
        <Footer />
      </div>
      <MobileBar />
    </QuoteProvider>
  );
}
