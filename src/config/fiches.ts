import type { ServiceId } from "./offer";

/**
 * Fiches prestation - DONNÉES TEST, à relire avec le client.
 * Une fiche par métier : ce qui est compris, quand y penser, puis la demande de rappel.
 */
export type Fiche = {
  slug: string;
  title: string;
  lede: string;
  photo: { src: string; alt: string; position?: string };
  facts: [string, string][];
  includes: string[];
  signs: string[];
};

export const fiches: Record<ServiceId, Fiche> = {
  ravalement: {
    slug: "ravalement-facade",
    title: "Ravalement de façade",
    lede: "On pique ce qui sonne creux, on reprend l'enduit, on traite les fissures et on termine par une finition neuve. Votre façade repart pour quinze à vingt ans.",
    photo: { src: "/images/service-ravalement.webp", alt: "Un façadier sur son échafaudage étale un enduit neuf à la taloche", position: "50% 30%" },
    facts: [
      ["Durée du chantier", "2 à 4 semaines"],
      ["Tenue", "15 à 20 ans"],
      ["Garantie", "Décennale"],
    ],
    includes: [
      "Diagnostic du support : sondage de l'enduit, relevé des fissures",
      "Échafaudage, filets et protection des sols et des menuiseries",
      "Piquage des zones décollées et reprise de l'enduit",
      "Traitement des fissures avec trame de renfort",
      "Finition au choix : enduit taloché, gratté ou peinture",
      "Nettoyage du chantier et réception avec vous",
    ],
    signs: ["L'enduit sonne creux ou se décolle par plaques", "Des fissures laissent passer l'eau", "La mairie vous a adressé une injonction de ravalement", "Vous vendez, ou vous venez d'acheter"],
  },
  nettoyage: {
    slug: "nettoyage-facade",
    title: "Nettoyage et démoussage",
    lede: "Coulures noires, pollution, mousses et lichens : on lave à basse pression, avec le produit adapté à votre support. La façade retrouve sa teinte sans que l'enduit en souffre.",
    photo: { src: "/images/service-nettoyage.webp", alt: "Nettoyage d'un enduit à la lance : la partie lavée est nettement plus claire" },
    facts: [
      ["Durée du chantier", "1 à 3 jours"],
      ["Méthode", "Basse pression"],
      ["Résultat", "Visible le jour même"],
    ],
    includes: [
      "Essai sur une zone discrète avant de commencer",
      "Protection des plantations, des vitres et des menuiseries",
      "Lavage basse pression ou nébulisation, selon le support",
      "Traitement anti-mousse à action lente",
      "Rinçage et contrôle, mur par mur",
    ],
    signs: ["Des coulures noires sous les appuis de fenêtre", "Une façade nord qui verdit", "Un enduit sain, mais terne", "Avant une mise en peinture ou un hydrofuge"],
  },
  peinture: {
    slug: "peinture-facade",
    title: "Peinture de façade",
    lede: "Une préparation soignée, une couche d'impression, deux couches de finition. Et vous choisissez la teinte sur votre mur, pas sur un nuancier en papier.",
    photo: { src: "/images/service-peinture.webp", alt: "Un peintre passe au rouleau une première bande claire sur une façade ocre", position: "50% 35%" },
    facts: [
      ["Durée du chantier", "1 à 2 semaines"],
      ["Teintes", "Plus de 80"],
      ["Tenue garantie", "10 ans"],
    ],
    includes: [
      "Lavage et traitement du support",
      "Rebouchage des fissures fines et ratissage",
      "Couche d'impression fixatrice",
      "Deux couches de peinture minérale ou pliolite",
      "Essai de teinte grandeur nature avant de valider",
      "Volets, sous-faces et ferronneries sur demande",
    ],
    signs: ["La teinte a passé, ou farine au toucher", "Vous voulez changer de couleur", "L'enduit est sain, mais taché", "Après un nettoyage, pour protéger durablement"],
  },
  hydrofuge: {
    slug: "hydrofuge-facade",
    title: "Imperméabilisation hydrofuge",
    lede: "Un traitement incolore qui fait perler l'eau en surface et laisse le mur respirer. La façade se salit moins vite, et l'humidité ne s'installe plus.",
    photo: { src: "/images/bourg-apres.webp", alt: "Maison de bourg à l'enduit beige clair, nettoyée puis protégée par un hydrofuge", position: "50% 60%" },
    facts: [
      ["Durée du chantier", "1 jour"],
      ["Aspect", "Invisible"],
      ["Tenue", "8 à 10 ans"],
    ],
    includes: [
      "Nettoyage préalable du support",
      "Protection des vitrages et des menuiseries",
      "Application en deux passes, jusqu'à saturation",
      "Produit microporeux : le mur continue de respirer",
      "Contrôle de l'effet perlant en fin de chantier",
    ],
    signs: ["L'enduit fonce dès qu'il pleut", "Les mousses reviennent vite après un nettoyage", "Un mur exposé aux pluies battantes", "Juste après un ravalement, pour le protéger"],
  },
  fissures: {
    slug: "traitement-fissures",
    title: "Traitement des fissures",
    lede: "Une fissure qui laisse entrer l'eau s'aggrave à chaque hiver. On l'ouvre, on la ponte, on la rebouche, puis on rend la réparation invisible.",
    photo: { src: "/images/etape-diagnostic.webp", alt: "Un technicien examine une fissure sur un enduit ancien, tablette à la main" },
    facts: [
      ["Durée du chantier", "1 à 3 jours"],
      ["Diagnostic", "Gratuit"],
      ["Garantie", "Décennale"],
    ],
    includes: [
      "Diagnostic : fissure d'enduit ou fissure de structure",
      "Ouverture et dépoussiérage de la fissure",
      "Pontage avec trame, ou agrafage selon le cas",
      "Rebouchage au mortier adapté au support",
      "Reprise de la finition pour fondre la réparation",
    ],
    signs: ["Des fissures en escalier le long des joints", "Une fissure qui s'élargit d'une année à l'autre", "Des traces d'humidité à l'intérieur, au droit de la fissure", "Avant une peinture ou un ravalement"],
  },
  ite: {
    slug: "isolation-exterieure",
    title: "Isolation par l'extérieur",
    lede: "On pose l'isolant sur vos murs, puis un enduit de finition par-dessus. En une opération, la façade est neuve et la maison garde sa chaleur, sans perdre un mètre carré à l'intérieur.",
    photo: { src: "/images/realisation-contemporaine.webp", alt: "Maison contemporaine à l'enduit blanc et gris anthracite, isolée par l'extérieur", position: "50% 45%" },
    facts: [
      ["Durée du chantier", "3 à 6 semaines"],
      ["Qualification", "RGE"],
      ["Aides", "Selon votre situation"],
    ],
    includes: [
      "Étude des murs et choix de l'isolant",
      "Aide au montage des dossiers d'aides",
      "Pose de l'isolant, collé et chevillé",
      "Traitement des tableaux et des appuis de fenêtre",
      "Sous-enduit armé et finition dans la teinte choisie",
      "Réception et attestation de fin de travaux",
    ],
    signs: ["Des murs froids et des factures de chauffage qui grimpent", "Un ravalement à faire de toute façon", "Pas de place pour isoler par l'intérieur", "Une vente ou une location à préparer"],
  },
};

export const ficheHref = (id: ServiceId) => `/prestations/${fiches[id].slug}`;
