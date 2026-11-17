/**
 * ============================================================
 *  CONFIG DU SITE - TOUTES LES DONNÉES SONT DES DONNÉES TEST
 * ============================================================
 *  Remplace ici le nom, le téléphone, les chiffres, les avis,
 *  les prix et les zones par les vraies infos du client.
 *  Quand tout est réel, passe `demo` à false : ça retire les
 *  mentions "exemple" affichées sur le site.
 *
 *  Le numéro 01 99 00 12 34 est dans la plage réservée par
 *  l'ARCEP aux fictions : il ne sonne chez personne.
 * ============================================================
 */

export const site = {
  demo: true,

  name: "Ravel",
  legalName: "Ravel Façades SAS",
  tagline: "Façades & peinture",
  url: "https://ravel-facades.vercel.app",

  phone: "01 99 00 12 34",
  phoneHref: "+33199001234",
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
  callbackDelay: "24\u00a0h",
  quoteDelay: "48\u00a0h",
  guaranteeYears: 10,

  rating: { value: 4.9, count: 327 },

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

  reviews: [
    { name: "Catherine L.", city: "Palaiseau", date: "Octobre 2026", job: "Ravalement complet", text: "Maison de 1978 avec des coulures noires partout. Trois semaines plus tard, les voisins pensaient qu'on avait fait construire. Chantier propre, bâches tous les soirs." },
    { name: "Marc D.", city: "Versailles", date: "Septembre 2026", job: "Nettoyage + hydrofuge", text: "Devis reçu en deux jours, très détaillé, sans surprise à la fin. L'équipe a protégé les massifs et les fenêtres comme si c'était chez eux." },
    { name: "Sophie et Karim B.", city: "Massy", date: "Août 2026", job: "Peinture façade", text: "On hésitait sur la teinte, ils sont venus avec des échantillons sur le mur. Le résultat est exactement ce qu'on voulait." },
    { name: "Jean-Pierre M.", city: "Corbeil-Essonnes", date: "Juillet 2026", job: "Traitement fissures", text: "Fissures en escalier sur le pignon. Explications claires, réparation nette, et l'enduit est invisible. Je recommande sans hésiter." },
    { name: "Copropriété Les Tilleuls", city: "Antony", date: "Juin 2026", job: "Ravalement immeuble", text: "Immeuble de 18 lots. Planning tenu, communication régulière avec le syndic, réception sans réserve." },
    { name: "Hélène R.", city: "Étampes", date: "Mai 2026", job: "Démoussage", text: "Façade nord verte de mousse. Traitée en une journée, et un an après, toujours rien. Prix honnête." },
  ],
} as const;

export type Site = typeof site;
