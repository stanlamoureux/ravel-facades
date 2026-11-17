import type { MetadataRoute } from "next";
import { fiches } from "@/config/fiches";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...Object.values(fiches).map((f) => ({ url: `${site.url}/prestations/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
