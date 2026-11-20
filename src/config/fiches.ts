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
    slug: "peinture-interieure-exterieure",
    title: "Peinture intérieure et extérieure",
    lede: "Façade, séjour, chambres ou cage d'escalier : une préparation soignée, une impression, deux couches de finition. Et vous choisissez la teinte sur votre mur, pas sur un nuancier en papier.",
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
      "Pièces de vie, plafonds et boiseries à l'intérieur",
      "Volets, sous-faces et ferronneries sur demande",
    ],
    signs: ["La teinte a passé, ou farine au toucher", "Vous emménagez ou vous rafraîchissez une pièce", "L'enduit est sain, mais taché", "Après un nettoyage, pour protéger durablement"],
  },
  hydrofuge: {
    slug: "hydrofuge-facade",
    title: "Traitement hydrofuge et imperméabilisation",
    lede: "Un traitement incolore qui fait perler l'eau en surface et laisse le mur respirer. La façade se salit moins vite, et l'humidité ne s'installe plus.",
    photo: { src: "/images/realisation-longere.webp", alt: "Longère à l'enduit ocre, protégée par un hydrofuge incolore", position: "50% 55%" },
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
    title: "Réparation des fissures par agrafage",
    lede: "Une fissure qui laisse entrer l'eau s'aggrave à chaque hiver. On ouvre le mur, on pose des agrafes pour le recoudre, on rebouche, puis on rend la réparation invisible.",
    photo: { src: "/images/vrai-fissure-reprise.webp", alt: "Mur ouvert et repris au mortier autour d'une fissure" },
    facts: [
      ["Durée du chantier", "1 à 3 jours"],
      ["Diagnostic", "Gratuit"],
      ["Garantie", "Décennale"],
    ],
    includes: [
      "Diagnostic : fissure d'enduit ou fissure de structure",
      "Ouverture et dépoussiérage de la fissure",
      "Agrafage : agrafes scellées en travers de la fissure pour recoudre la maçonnerie",
      "Rebouchage au mortier adapté au support",
      "Reprise de la finition pour fondre la réparation",
    ],
    signs: ["Des fissures en escalier le long des joints", "Une fissure qui s'élargit d'une année à l'autre", "Des traces d'humidité à l'intérieur, au droit de la fissure", "Avant une peinture ou un ravalement"],
  },
  boiseries: {
    slug: "nettoyage-boiseries-volets",
    title: "Nettoyage des boiseries et volets",
    lede: "Le bois grisé ou verdi n'est pas fichu. On le lave en douceur, on l'éclaircit, puis on le protège pour qu'il garde sa couleur.",
    photo: { src: "/images/vrai-realisation-volets-bois.webp", alt: "Maison à la façade blanche et aux volets en bois", position: "50% 50%" },
    facts: [
      ["Durée du chantier", "1 à 2 jours"],
      ["Supports", "Volets, portails, bardages"],
      ["Finition", "Saturateur ou lasure"],
    ],
    includes: [
      "Dépose des volets si besoin, ou protection sur place",
      "Lavage doux adapté au bois, sans le pelucher",
      "Dégriseur pour retrouver la teinte d'origine",
      "Protection au saturateur ou à la lasure, au choix",
      "Repose et nettoyage des abords",
    ],
    signs: ["Le bois est devenu gris ou noirci", "Des mousses verdissent le bas des volets", "La lasure s'écaille par endroits", "Avant de repeindre, pour partir sur un bois sain"],
  },
  dallage: {
    slug: "nettoyage-dallages-murets",
    title: "Nettoyage des dalles, dallages et murets",
    lede: "Terrasse glissante, allée noircie, muret couvert de lichens : on nettoie le support sans l'abîmer, on reprend les joints, et on protège.",
    photo: { src: "/images/vrai-realisation-pavillon-blanc-2.webp", alt: "Pavillon blanc et sa terrasse", position: "50% 70%" },
    facts: [
      ["Durée du chantier", "1 à 2 jours"],
      ["Supports", "Pierre, béton, pavés"],
      ["Protection", "Hydrofuge en option"],
    ],
    includes: [
      "Nettoyage haute ou basse pression selon le support",
      "Traitement anti-mousse et anti-lichen",
      "Reprise des joints abîmés",
      "Couvertines et chaperons de murets nettoyés",
      "Hydrofuge en option, pour que ça reste propre plus longtemps",
    ],
    signs: ["La terrasse devient glissante à la pluie", "Les joints se creusent et l'herbe pousse", "Un muret noirci ou couvert de lichens", "Une maison à vendre ou à louer"],
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

/** Le reste de chaque fiche : un chantier à comparer, le déroulé, un avis et les questions qu'on nous pose. */
export type Extra = {
  compare?: { before: string; after: string; caption: string; position?: string };
  /** À défaut d'avant / après : deux photos de chantier. */
  photos?: { src: string; alt: string }[];
  steps: [string, string][];
  review: string; // nom de l'avis à citer, pris dans site.reviews
  faq: [string, string][];
};

export const extras: Record<ServiceId, Extra> = {
  ravalement: {
    compare: { before: "pavillon-avant", after: "pavillon-apres", caption: "Illustration d'un ravalement complet" },
    steps: [
      ["Diagnostic", "On sonde l'enduit, on relève chaque fissure et on mesure la façade."],
      ["Préparation", "Échafaudage, bâches, piquage des zones qui sonnent creux."],
      ["Reprise", "Fissures traitées, enduit refait, support remis à niveau."],
      ["Finition", "Enduit ou peinture dans la teinte validée, puis réception avec vous."],
    ],
    review: "Catherine L.",
    faq: [
      ["Faut-il une déclaration en mairie ?", "Oui dès que l'aspect change, et parfois même à l'identique selon la commune. On prépare le dossier avec vous."],
      ["Peut-on rester dans la maison ?", "Oui. Les fenêtres sont protégées, et on vous prévient la veille des journées les plus bruyantes."],
      ["Combien de temps tient un ravalement ?", "Quinze à vingt ans avec un entretien léger, comme un nettoyage tous les cinq à huit ans."],
    ],
  },
  nettoyage: {
    compare: { before: "bourg-avant", after: "bourg-apres", caption: "Illustration d'un nettoyage avec hydrofuge", position: "50% 60%" },
    steps: [
      ["Essai", "On teste le produit et la pression sur une zone discrète."],
      ["Protection", "Plantations, vitres et menuiseries sont couvertes."],
      ["Lavage", "Basse pression ou nébulisation, mur par mur."],
      ["Traitement", "Un anti-mousse qui continue d'agir pendant des semaines."],
    ],
    review: "Hélène R.",
    faq: [
      ["Le nettoyage abîme-t-il l'enduit ?", "Non. On travaille à basse pression, avec un produit choisi pour votre support après un essai."],
      ["Combien de temps reste-t-elle propre ?", "Cinq à huit ans en moyenne, davantage si on ajoute un hydrofuge juste après."],
      ["Faut-il un échafaudage ?", "Rarement pour une maison : une nacelle ou des perches suffisent le plus souvent."],
    ],
  },
  peinture: {
    compare: { before: "maison-avant", after: "maison-apres", caption: "Illustration d'une mise en peinture", position: "50% 72%" },
    steps: [
      ["Essai de teinte", "On peint des échantillons sur votre mur pour choisir en vrai."],
      ["Préparation", "Lavage, rebouchage des fissures fines, impression."],
      ["Deux couches", "Peinture minérale ou pliolite, appliquée par temps sec."],
      ["Détails", "Volets, sous-faces et ferronneries si vous le souhaitez."],
    ],
    review: "Sophie et Karim B.",
    faq: [
      ["Peut-on changer complètement de couleur ?", "Oui, dans les teintes autorisées par votre commune. On vérifie le règlement avec vous."],
      ["Quelle peinture choisir ?", "Minérale sur un enduit à la chaux, pliolite sur les supports plus fermés. On vous conseille après le diagnostic."],
      ["Combien de temps tient la peinture ?", "Dix ans garantis contre le décollement et le cloquage, souvent bien plus."],
    ],
  },
  hydrofuge: {
    compare: { before: "bourg-avant", after: "bourg-apres", caption: "Illustration d'un nettoyage puis d'un hydrofuge", position: "50% 60%" },
    steps: [
      ["Nettoyage", "Le support doit être propre et sec avant traitement."],
      ["Protection", "Vitrages et menuiseries sont couverts."],
      ["Application", "Deux passes, jusqu'à ce que le mur ne boive plus."],
      ["Contrôle", "On vérifie que l'eau perle partout avant de partir."],
    ],
    review: "Marc D.",
    faq: [
      ["Le traitement se voit-il ?", "Non, il est incolore et ne change ni la teinte ni l'aspect de l'enduit."],
      ["Le mur peut-il encore respirer ?", "Oui, le produit est microporeux : il bloque l'eau de pluie, pas la vapeur."],
      ["Quand faut-il le refaire ?", "Tous les huit à dix ans environ. Le test de la goutte d'eau vous le dira."],
    ],
  },
  fissures: {
    photos: [
      { src: "/images/vrai-fissure-avant.webp", alt: "Large fissure dans l'enduit, avant réparation" },
      { src: "/images/vrai-fissure-apres.webp", alt: "Le même mur après agrafage et reprise de l'enduit" },
    ],
    steps: [
      ["Diagnostic", "Fissure d'enduit ou de structure : on fait la différence."],
      ["Ouverture", "La fissure est ouverte et dépoussiérée."],
      ["Agrafage", "Des agrafes sont scellées en travers pour recoudre le mur."],
      ["Finition", "Rebouchage et reprise de l'enduit pour tout fondre."],
    ],
    review: "Jean-Pierre M.",
    faq: [
      ["Une fissure est-elle grave ?", "La plupart sont superficielles. Si elle dépasse 2 mm ou s'élargit, on vous oriente vers un bureau d'études."],
      ["La réparation se verra-t-elle ?", "Non, on reprend la finition sur toute la zone pour qu'elle disparaisse."],
      ["Faut-il refaire toute la façade ?", "Pas forcément. Quelques fissures se traitent seules, en un à trois jours."],
    ],
  },
  boiseries: {
    photos: [
      { src: "/images/vrai-realisation-volets-bois.webp", alt: "Volets en bois sur une façade blanche" },
      { src: "/images/vrai-chantier-peinture.webp", alt: "Pignon préparé, un artisan sur l'échelle" },
    ],
    steps: [
      ["Protection", "Vitrages, façade et sols protégés, volets déposés si besoin."],
      ["Lavage", "Un lavage doux qui retire mousses et saletés sans abîmer les fibres."],
      ["Éclaircissement", "Le dégriseur redonne au bois sa teinte d'origine."],
      ["Protection", "Saturateur ou lasure, une fois le bois bien sec."],
    ],
    review: "",
    faq: [
      ["Peut-on nettoyer des volets peints ?", "Oui. Si la peinture s'écaille, on vous propose plutôt un décapage puis une remise en peinture."],
      ["Le bois risque-t-il de s'abîmer ?", "Non, la pression et les produits sont adaptés au bois pour ne pas le pelucher."],
      ["Combien de temps tient la protection ?", "Trois à cinq ans environ selon l'exposition. Un simple entretien suffit ensuite."],
    ],
  },
  dallage: {
    photos: [
      { src: "/images/vrai-realisation-pavillon-blanc-2.webp", alt: "Pavillon blanc côté terrasse" },
      { src: "/images/vrai-realisation-pavillon-blanc.webp", alt: "Pavillon et terrasse vus depuis le jardin" },
    ],
    steps: [
      ["Diagnostic", "Pierre, béton ou pavés : on choisit la méthode qui ne marque pas."],
      ["Nettoyage", "Mousses, lichens et traces noires retirés."],
      ["Joints", "Les joints creusés sont repris."],
      ["Protection", "Hydrofuge en option pour ralentir le retour des mousses."],
    ],
    review: "",
    faq: [
      ["Le nettoyeur haute pression abîme-t-il la pierre ?", "Il peut, sur une pierre tendre. C'est pour ça qu'on adapte la pression et la buse à chaque support."],
      ["Combien de temps reste-t-il propre ?", "Un à trois ans sans protection, nettement plus avec un hydrofuge."],
      ["Faites-vous les murets en pierre ?", "Oui, murets, couvertines et chaperons, avec les joints si besoin."],
    ],
  },
  ite: {
    compare: { before: "immeuble-avant", after: "immeuble-apres", caption: "Illustration d'une façade entièrement reprise", position: "50% 22%" },
    steps: [
      ["Étude", "Murs, menuiseries et aides possibles : on fait le point."],
      ["Pose", "Isolant collé et chevillé, tableaux et appuis traités."],
      ["Armature", "Sous-enduit armé pour une façade sans fissure."],
      ["Finition", "Enduit dans la teinte choisie, attestation de fin de travaux."],
    ],
    review: "Copropriété Les Tilleuls",
    faq: [
      ["Combien gagne-t-on sur le chauffage ?", "Cela dépend de la maison. L'étude de départ vous donne une estimation avant de vous engager."],
      ["Existe-t-il des aides ?", "Souvent, selon vos revenus et votre logement. On vous aide à monter les dossiers."],
      ["Perd-on de la surface ?", "Non à l'intérieur. La façade s'épaissit de quelques centimètres vers l'extérieur."],
    ],
  },

};
