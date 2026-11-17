const NBSP = String.fromCharCode(160);

/** Typographie française : jamais de retour à la ligne juste avant : ; ? ! */
export const typo = (s: string) => s.replace(/ ([:;?!])/g, NBSP + "$1");
