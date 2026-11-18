/** Les chapitres de la page d'accueil, dans l'ordre : quatre métiers, puis le contact. */
export const chapters = [
  { id: "ravalement", title: "Ravalement de façade", short: "Ravalement", hint: "Enduit, fissures, isolation", photo: "/images/service-ravalement.webp", work: "Ravalement" },
  { id: "peinture", title: "Peinture", short: "Peinture", hint: "Intérieure et extérieure", photo: "/images/peinture-interieure.webp", work: "Peinture" },
  { id: "nettoyage", title: "Nettoyage de façade", short: "Nettoyage", hint: "Démoussage, hydrofuge", photo: "/images/service-nettoyage.webp", work: "Nettoyage" },
  { id: "couverture", title: "Couverture", short: "Couverture", hint: "Toiture et zinguerie", photo: "/images/couverture-toiture.webp", work: "Couverture" },
  { id: "contact", title: "Contact", short: "Contact", hint: "Devis gratuit sous 24 h", photo: null, work: null },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
export const chapterAnchor = (id: ChapterId) => `chapitre-${id}`;

/**
 * Avancement de la lecture : -1 avant le premier chapitre, 1.5 à la moitié du deuxième.
 * La ligne de lecture est placée au tiers de l'écran.
 */
export function readingProgress() {
  const line = window.innerHeight * 0.35;
  let p = -1;
  chapters.forEach((c, i) => {
    const el = document.getElementById(chapterAnchor(c.id));
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top <= line) p = i + Math.min(1, Math.max(0, (line - r.top) / r.height));
  });
  return p;
}
