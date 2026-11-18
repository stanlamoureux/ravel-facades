/** Les chapitres de la page d'accueil, dans l'ordre : quatre métiers, puis le contact. */
export const chapters = [
  { id: "ravalement", title: "Ravalement de façade", hint: "Enduit, fissures, isolation" },
  { id: "peinture", title: "Peinture", hint: "Intérieure et extérieure" },
  { id: "nettoyage", title: "Nettoyage de façade", hint: "Démoussage, hydrofuge" },
  { id: "couverture", title: "Couverture", hint: "Toiture et zinguerie" },
  { id: "contact", title: "Contact", hint: "Devis gratuit, rappel sous 24 h" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
export const chapterAnchor = (id: ChapterId) => `chapitre-${id}`;
