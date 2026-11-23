import { site } from "./site";

export const faq = [
  {
    topic: "Prix",
    q: "Combien coûte un ravalement de façade ?",
    a: `Tout dépend de la surface, de l'état du support et de la finition choisie. Le simulateur calcule une estimation pour votre façade en 30 secondes et vous l'envoie par email. Le prix ferme est donné après la visite, gratuite, sous ${site.quoteDelay}.`,
  },
  {
    topic: "Mairie",
    q: "Faut-il une autorisation de la mairie ?",
    a: "Changer de teinte ou modifier l'aspect extérieur demande en général une déclaration préalable de travaux, et certaines communes l'imposent pour tout ravalement. Le délai d'instruction est d'environ un mois. On prépare le dossier avec vous.",
  },
  {
    topic: "Obligation",
    q: "Le ravalement est-il obligatoire ?",
    a: "Seulement dans les communes qui l'ont décidé, sur injonction de la mairie. Ailleurs, et c'est le cas de la plupart des communes de Sologne, c'est surtout une question d'entretien : une façade négligée laisse entrer l'eau et coûte plus cher à reprendre.",
  },
  {
    topic: "Durée",
    q: "Combien de temps durent les travaux ?",
    a: "Un nettoyage se fait en 1 à 3 jours. Comptez 1 à 2 semaines pour une peinture de pavillon, 2 à 4 semaines pour un ravalement complet, davantage pour un immeuble. La date de démarrage et la durée sont écrites dans le devis.",
  },
  {
    topic: "Présence",
    q: "Dois-je être présent pendant le chantier ?",
    a: "Non. On a besoin d'un accès à l'extérieur et à un point d'eau. Vous recevez un point d'avancement chaque fin de semaine, avec photos.",
  },
  {
    topic: "Saison",
    q: "À quelle saison faire les travaux ?",
    a: "Du printemps à l'automne, par temps sec et au-dessus de 5 °C, pour que les produits sèchent correctement. Les visites et les devis se font toute l'année : réserver l'hiver permet de démarrer dès les beaux jours.",
  },
  {
    topic: "Garanties",
    q: "Quelles garanties avez-vous ?",
    a: `Assurance responsabilité civile et garantie décennale, dont l'attestation est jointe au devis. Les peintures appliquées sont garanties ${site.guaranteeYears} ans contre le décollement et le cloquage.`,
  },
];
