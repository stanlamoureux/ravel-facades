/**
 * ============================================================
 *  CONFIG DU SITE - TOUTES LES DONNÉES SONT DES DONNÉES TEST
 * ============================================================
 *  Remplace ici le nom, le téléphone, les chiffres, les avis,
 *  les prix et les zones par les vraies infos du client.
 *  Quand tout est réel, passe `demo` à false : ça retire les
 *  mentions "exemple" affichées sur le site.
 *
 *  Vrai numéro du client. Le client ne veut pas que son nom apparaisse sur le site, sauf dans les mentions légales (obligatoire).
 * ============================================================
 */

export const site = {
  demo: true,

  name: "Ravel",
  /** Identité légale (registre national des entreprises) */
  legalName: "Steevy GARAND (EI)",
  legal: {
    form: "Entrepreneur individuel (EI)",
    siren: "948 180 856",
    tva: "FR23948180856",
    rcs: "RCS Évry",
    naf: "81.21Z",
    registeredOn: "17 janvier 2023",
    /** Assurance décennale : à compléter (assureur, n° de contrat) pour l'afficher */
    insurance: null as null | { insurer: string; contract: string },
  },
  tagline: "Façades & peinture",
  url: "https://ravalement41.fr",

  phone: "06 79 77 38 71",
  phoneHref: "+33679773871",
  /** Vraie adresse email du client : vide tant qu'on ne l'a pas, et rien ne s'affiche. */
  email: "",
  address: {
    street: "195 route de Touchebrault",
    postalCode: "41230",
    city: "Soings-en-Sologne",
  },
  hours: "Du lundi au samedi, 8 h - 19 h",
  siret: "948 180 856 00015",
  foundedYear: 2023,

  /** Délai de rappel affiché partout (promesse commerciale) */
  callbackDelay: "24 h",
  quoteDelay: "48 h",
  guaranteeYears: 10,

  rating: { value: 4.9, count: 327 },

  /** Légende de la photo d'équipe */
  teamCaption: "L'équipe à l'œuvre : enduit repris à la taloche, puis façade d'une maison de ville.",

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

  /** Zones d'intervention depuis Soings-en-Sologne, à valider avec le client. */
  zones: [
    { code: "41", name: "Loir-et-Cher", cities: ["Soings-en-Sologne", "Romorantin-Lanthenay", "Le Controis-en-Sologne", "Blois", "Cour-Cheverny", "Selles-sur-Cher", "Saint-Aignan", "Mur-de-Sologne"] },
    { code: "37", name: "Indre-et-Loire", cities: ["Amboise", "Bléré", "Loches", "Montlouis-sur-Loire"] },
    { code: "36", name: "Indre", cities: ["Valençay", "Châtillon-sur-Indre"] },
    { code: "18", name: "Cher", cities: ["Vierzon", "Mehun-sur-Yèvre"] },
    { code: "45", name: "Loiret", cities: ["La Ferté-Saint-Aubin", "Orléans sud"] },
  ],

  /** Avis clients : à remplir avec de vrais avis (Google) avant de les afficher. */
  reviews: [] as { name: string; city: string; date: string; job: string; text: string }[],
} as const;

export type Site = typeof site;
