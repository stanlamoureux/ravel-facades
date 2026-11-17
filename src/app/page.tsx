import { site } from "@/config/site";
import { services } from "@/config/offer";
import { QuoteProvider } from "@/components/QuoteContext";
import { Nav, MobileBar } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Proof } from "@/components/Proof";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Nuancier } from "@/components/Nuancier";
import { Simulator } from "@/components/Simulator";
import { Journey } from "@/components/Journey";
import { Reviews } from "@/components/Reviews";
import { Zones } from "@/components/Zones";
import { FAQ } from "@/components/FAQ";
import { QuoteSection } from "@/components/QuoteForm";
import { Footer } from "@/components/Footer";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#devis" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Aller au formulaire de devis
      </a>
      <Nav />
      <main>
        <Hero />
        <Proof />
        <Services />
        <BeforeAfter />
        <Nuancier />
        <Simulator />
        <Journey />
        <Reviews />
        <Zones />
        <FAQ />
        <QuoteSection />
      </main>
      <Footer />
      <MobileBar />
    </QuoteProvider>
  );
}
