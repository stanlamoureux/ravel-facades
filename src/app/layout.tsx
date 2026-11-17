import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";

const description = `Nettoyage, ravalement et peinture de façades en Île-de-France. Visite et devis gratuits sous ${site.quoteDelay}, travaux garantis ${site.guaranteeYears} ans.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Ravalement, nettoyage et peinture de façade en Île-de-France`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: ["ravalement de façade", "nettoyage façade", "peinture façade", "démoussage", "hydrofuge", "Essonne", "Île-de-France"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} - Votre façade, comme au premier jour`,
    description,
  },
  twitter: { card: "summary_large_image" },
  robots: site.demo ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
