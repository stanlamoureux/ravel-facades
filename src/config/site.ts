/**
 * ============================================================
 *  CONFIG DU SITE - TOUTES LES DONNÉES SONT DES DONNÉES TEST
 * ============================================================
 *  Remplace ici le nom, le téléphone, les chiffres, les avis,
 *  les prix et les zones par les vraies infos du client.
 *  Quand tout est réel, passe `demo` à false : ça retire les
 *  mentions "exemple" affichées sur le site.
 *
 *  Le téléphone est celui de Steevy Grand (vrai numéro).
 * ============================================================
 */

export const site = {
  demo: true,

  name: "Ravel",
  legalName: "Ravel Façades SAS",
  tagline: "Façades & peinture",
  url: "https://ravel-facades.vercel.app",

  phone: "06 79 77 38 71",
  phoneHref: "+33679773871",
  email: "contact@ravel-facades.fr",
  address: {
    street: "12 rue des Artisans",
    postalCode: "91000",
    city: "Évry-Courcouronnes",
  },
  hours: "Du lundi au samedi, 8 h - 19 h",
  siret: "000 000 000 00000",
  foundedYear: 2011,

  /** Délai de rappel affiché partout (promesse commerciale) */
  callbackDelay: "24 h",
  quoteDelay: "48 h",
  guaranteeYears: 10,

  rating: { value: 4.9, count: 327 },

  /** Légende de la photo d'équipe */
  teamCaption: "Steevy Grand et son équipe sur un pignon, enduit repris à la taloche.",

  stats: [
    { value: 1240, suffix: "", label: "façades rénovées depuis 2011" },
    { value: 15, suffix: " ans", label: "d'expérience en ravalement" },
    { value: 98, suffix: " %", label: "de clients qui nous recommandent" },
    { value: 10, suffix: " ans", label: "de garantie décennale" },
  ],

  certifications: [
    { name: "RGE", detail: "Reconnu garant de l'environnement" },
    { name: "Qualibat", detail: "Ravalement et peinture" },
    { name: "Décennale", detail: "Assurance 10 ans sur les travaux" },
  ],

  zones: [
    { code: "91", name: "Essonne", cities: ["Évry", "Corbeil-Essonnes", "Massy", "Palaiseau", "Étampes", "Savigny-sur-Orge", "Brétigny-sur-Orge", "Milly-la-Forêt"] },
    { code: "78", name: "Yvelines", cities: ["Versailles", "Rambouillet", "Saint-Germain-en-Laye", "Le Chesnay", "Poissy"] },
    { code: "92", name: "Hauts-de-Seine", cities: ["Antony", "Sceaux", "Rueil-Malmaison", "Boulogne-Billancourt"] },
    { code: "94", name: "Val-de-Marne", cities: ["Créteil", "Vincennes", "Saint-Maur-des-Fossés"] },
    { code: "77", name: "Seine-et-Marne", cities: ["Fontainebleau", "Melun", "Meaux"] },
    { code: "75", name: "Paris", cities: ["Tous arrondissements"] },
  ],

  /** Avis clients : à remplir avec de vrais avis (Google) avant de les afficher. */
  reviews: [] as { name: string; city: string; date: string; job: string; text: string }[],
} as const;

export type Site = typeof site;
