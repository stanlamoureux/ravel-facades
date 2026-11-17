const nf = new Intl.NumberFormat("fr-FR");

/** 1240 -> "1 240", avec une espace insécable classique (l'espace fine d'Intl n'existe pas dans la police). */
export const nombre = (n: number) => nf.format(n).replace(/[  ]/g, " ");
