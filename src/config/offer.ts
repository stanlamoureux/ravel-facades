/**
 * Prestations, prix et nuancier - DONNÉES TEST, à ajuster avec le client.
 * Les prix sont des fourchettes TTC au m² de façade, utilisées par le simulateur.
 */

export type ServiceId = "nettoyage" | "hydrofuge" | "peinture" | "ravalement" | "fissures" | "ite";

export const services: {
  id: ServiceId;
  name: string;
  short: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  unit: string;
  duration: string;
}[] = [
  {
    id: "ravalement",
    name: "Ravalement complet",
    short: "Ravalement",
    description:
      "Piquage des zones abîmées, reprise de l'enduit, traitement des fissures et finition peinture ou enduit neuf. La façade retrouve son état d'origine, pour 15 à 20 ans.",
    priceFrom: 60,
    priceTo: 110,
    unit: "€/m²",
    duration: "2 à 4 semaines",
  },
  {
    id: "nettoyage",
    name: "Nettoyage & démoussage",
    short: "Nettoyage",
    description: "Lavage basse pression adapté au support et traitement anti-mousse. Coulures, pollution et lichen disparaissent sans agresser l'enduit.",
    priceFrom: 18,
    priceTo: 32,
    unit: "€/m²",
    duration: "1 à 3 jours",
  },
  {
    id: "peinture",
    name: "Peinture de façade",
    short: "Peinture",
    description: "Préparation, impression et deux couches de peinture minérale ou pliolite. Plus de 80 teintes, testées sur votre mur avant de choisir.",
    priceFrom: 38,
    priceTo: 65,
    unit: "€/m²",
    duration: "1 à 2 semaines",
  },
  {
    id: "hydrofuge",
    name: "Imperméabilisation",
    short: "Hydrofuge",
    description: "Un traitement invisible qui fait perler l'eau tout en laissant respirer le mur. Moins de salissures, moins d'humidité.",
    priceFrom: 12,
    priceTo: 22,
    unit: "€/m²",
    duration: "1 jour",
  },
  {
    id: "fissures",
    name: "Traitement des fissures",
    short: "Fissures",
    description: "Ouverture, pontage et rebouchage des fissures avant qu'elles ne laissent entrer l'eau dans la maçonnerie.",
    priceFrom: 25,
    priceTo: 45,
    unit: "€/ml",
    duration: "1 à 3 jours",
  },
  {
    id: "ite",
    name: "Isolation par l'extérieur",
    short: "ITE",
    description: "Isolant et enduit de finition en une seule opération : une façade neuve, et des murs qui ne laissent plus filer la chaleur. Des aides peuvent exister selon votre situation.",
    priceFrom: 140,
    priceTo: 210,
    unit: "€/m²",
    duration: "3 à 6 semaines",
  },
];

/** Prestations proposées dans le simulateur (prix au m² de façade). */
export const simulatorWorks = [
  { id: "nettoyage", label: "Nettoyage", detail: "Lavage + démoussage", min: 18, max: 32 },
  { id: "nettoyage-hydrofuge", label: "Nettoyage + hydrofuge", detail: "Lavage, démoussage, protection", min: 28, max: 48 },
  { id: "peinture", label: "Peinture", detail: "Préparation + 2 couches", min: 38, max: 65 },
  { id: "ravalement", label: "Ravalement complet", detail: "Enduit, fissures, finition", min: 60, max: 110 },
  { id: "ite", label: "Isolation extérieure", detail: "Isolant + enduit neuf", min: 140, max: 210 },
] as const;

export const propertyTypes = [
  { id: "maison", label: "Maison", factor: 1 },
  { id: "mitoyenne", label: "Maison mitoyenne", factor: 0.96 },
  { id: "immeuble", label: "Immeuble", factor: 1.08 },
] as const;

export const conditions = [
  { id: "bon", label: "Bon état", hint: "Juste encrassée", factor: 1 },
  { id: "moyen", label: "Quelques défauts", hint: "Fissures fines, mousse", factor: 1.12 },
  { id: "degrade", label: "Dégradée", hint: "Enduit qui se décolle", factor: 1.3 },
] as const;

export const heights = [
  { id: "rdc", label: "Plain-pied", factor: 0.92 },
  { id: "r1", label: "1 étage", factor: 1 },
  { id: "r2", label: "2 étages et +", factor: 1.15 },
] as const;

export const MIN_JOB = 1500;

export function estimate(opts: {
  surface: number;
  work: (typeof simulatorWorks)[number]["id"];
  property: (typeof propertyTypes)[number]["id"];
  condition: (typeof conditions)[number]["id"];
  height: (typeof heights)[number]["id"];
}) {
  const w = simulatorWorks.find((x) => x.id === opts.work)!;
  const f =
    propertyTypes.find((x) => x.id === opts.property)!.factor *
    conditions.find((x) => x.id === opts.condition)!.factor *
    heights.find((x) => x.id === opts.height)!.factor;
  const round = (n: number) => Math.round(n / 100) * 100;
  const low = Math.max(MIN_JOB, round(opts.surface * w.min * f));
  const high = Math.max(MIN_JOB + 600, round(opts.surface * w.max * f));
  return { low, high };
}

/** Nuancier - noms et références fictifs, à remplacer par la gamme du fournisseur. */
export const wallColors = [
  { id: "chaux", name: "Blanc de chaux", ref: "RV 101", hex: "#F2EFE8" },
  { id: "pierre", name: "Pierre de Paris", ref: "RV 118", hex: "#E8DDC7" },
  { id: "grege", name: "Grège", ref: "RV 124", hex: "#D8CDBB" },
  { id: "sable", name: "Sable ocré", ref: "RV 207", hex: "#E5CA98" },
  { id: "rose", name: "Rose briqueté", ref: "RV 312", hex: "#DDAA94" },
  { id: "perle", name: "Gris perle", ref: "RV 405", hex: "#D2D5D5" },
  { id: "amande", name: "Vert amande", ref: "RV 506", hex: "#CDD6C0" },
  { id: "brume", name: "Bleu brume", ref: "RV 603", hex: "#CBD2DC" },
] as const;

export const accentColors = [
  { id: "anthracite", name: "Gris anthracite", hex: "#3D434A" },
  { id: "ardoise", name: "Bleu ardoise", hex: "#4A6070" },
  { id: "wagon", name: "Vert wagon", hex: "#3E5A4A" },
  { id: "blanc", name: "Blanc", hex: "#F5F5F2" },
  { id: "bordeaux", name: "Bordeaux", hex: "#6C2F35" },
  { id: "chene", name: "Chêne clair", hex: "#A87A50" },
] as const;

export type WallColor = (typeof wallColors)[number];
export type AccentColor = (typeof accentColors)[number];
