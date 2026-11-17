import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";

const description = `Ravalement, peinture et nettoyage de façade en Essonne et en Île-de-France. Visite et devis gratuits sous ${site.quoteDelay}, travaux couverts par la garantie décennale.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Ravalement, peinture et nettoyage de façade en Essonne`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: ["ravalement de façade", "peinture façade", "nettoyage façade", "démoussage", "hydrofuge", "façadier Essonne", "Île-de-France"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} - Votre façade, comme neuve`,
    description,
    images: [{ url: "/images/partage.jpg", width: 1200, height: 630, alt: "Un pavillon avant et après ravalement" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/partage.jpg"] },
  robots: site.demo ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
