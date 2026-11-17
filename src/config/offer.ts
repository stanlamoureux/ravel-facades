/**
 * Prestations et nuancier - DONNÉES TEST, à ajuster avec le client.
 * Aucun prix ici : ils vivent dans pricing.ts, lu uniquement par le serveur.
 */

export type ServiceId = "nettoyage" | "hydrofuge" | "peinture" | "ravalement" | "fissures" | "ite";

export const services: { id: ServiceId; name: string; short: string; description: string; duration: string; estimateAs: WorkId }[] = [
  {
    id: "ravalement",
    name: "Ravalement complet",
    short: "Ravalement",
    description: "Piquage des zones abîmées, reprise de l'enduit, traitement des fissures et finition peinture ou enduit neuf. La façade retrouve son état d'origine, pour 15 à 20 ans.",
    duration: "2 à 4 semaines",
    estimateAs: "ravalement",
  },
  {
    id: "nettoyage",
    name: "Nettoyage & démoussage",
    short: "Nettoyage",
    description: "Lavage basse pression adapté au support et traitement anti-mousse. Coulures, pollution et lichen disparaissent sans agresser l'enduit.",
    duration: "1 à 3 jours",
    estimateAs: "nettoyage",
  },
  {
    id: "peinture",
    name: "Peinture de façade",
    short: "Peinture",
    description: "Préparation, impression et deux couches de peinture minérale ou pliolite. Plus de 80 teintes, testées sur votre mur avant de choisir.",
    duration: "1 à 2 semaines",
    estimateAs: "peinture",
  },
  {
    id: "hydrofuge",
    name: "Imperméabilisation",
    short: "Hydrofuge",
    description: "Un traitement invisible qui fait perler l'eau tout en laissant respirer le mur. Moins de salissures, moins d'humidité.",
    duration: "1 jour",
    estimateAs: "nettoyage-hydrofuge",
  },
  {
    id: "fissures",
    name: "Traitement des fissures",
    short: "Fissures",
    description: "Ouverture, pontage et rebouchage des fissures avant qu'elles ne laissent entrer l'eau dans la maçonnerie.",
    duration: "1 à 3 jours",
    estimateAs: "ravalement",
  },
  {
    id: "ite",
    name: "Isolation par l'extérieur",
    short: "ITE",
    description: "Isolant et enduit de finition en une seule opération : une façade neuve, et des murs qui ne laissent plus filer la chaleur. Des aides peuvent exister selon votre situation.",
    duration: "3 à 6 semaines",
    estimateAs: "ite",
  },
];

/** Choix proposés dans le simulateur d'estimation. */
export const simulatorWorks = [
  { id: "nettoyage", label: "Nettoyage", detail: "Lavage + démoussage" },
  { id: "nettoyage-hydrofuge", label: "Nettoyage + hydrofuge", detail: "Lavage, démoussage, protection" },
  { id: "peinture", label: "Peinture", detail: "Préparation + 2 couches" },
  { id: "ravalement", label: "Ravalement complet", detail: "Enduit, fissures, finition" },
  { id: "ite", label: "Isolation extérieure", detail: "Isolant + enduit neuf" },
] as const;

export const propertyTypes = [
  { id: "maison", label: "Maison" },
  { id: "mitoyenne", label: "Maison mitoyenne" },
  { id: "immeuble", label: "Immeuble" },
] as const;

export const conditions = [
  { id: "bon", label: "Bon état", hint: "Juste encrassée" },
  { id: "moyen", label: "Quelques défauts", hint: "Fissures fines, mousse" },
  { id: "degrade", label: "Dégradée", hint: "Enduit qui se décolle" },
] as const;

export const heights = [
  { id: "rdc", label: "Plain-pied" },
  { id: "r1", label: "1 étage" },
  { id: "r2", label: "2 étages et +" },
] as const;

export type WorkId = (typeof simulatorWorks)[number]["id"];
export type PropertyId = (typeof propertyTypes)[number]["id"];
export type ConditionId = (typeof conditions)[number]["id"];
export type HeightId = (typeof heights)[number]["id"];

export const SURFACE = { min: 40, max: 600, step: 5, initial: 140 };

/**
 * Nuancier - noms et références fictifs, à remplacer par la gamme du fournisseur.
 * La première teinte de chaque liste est celle de la photo du nuancier, affichée sans recoloration.
 */
export const wallColors = [
  { id: "pierre", name: "Pierre claire", ref: "RV 118", hex: "#F4E4CC" },
  { id: "chaux", name: "Blanc de chaux", ref: "RV 101", hex: "#F2EFE8" },
  { id: "grege", name: "Grège", ref: "RV 124", hex: "#D8CDBB" },
  { id: "sable", name: "Sable ocré", ref: "RV 207", hex: "#E5CA98" },
  { id: "rose", name: "Rose briqueté", ref: "RV 312", hex: "#DDAA94" },
  { id: "perle", name: "Gris perle", ref: "RV 405", hex: "#D2D5D5" },
  { id: "amande", name: "Vert amande", ref: "RV 506", hex: "#CDD6C0" },
  { id: "brume", name: "Bleu brume", ref: "RV 603", hex: "#CBD2DC" },
] as const;

export const accentColors = [
  { id: "wagon", name: "Vert wagon", hex: "#2F5E48" },
  { id: "anthracite", name: "Gris anthracite", hex: "#3D434A" },
  { id: "ardoise", name: "Bleu ardoise", hex: "#4A6070" },
  { id: "bordeaux", name: "Bordeaux", hex: "#6C2F35" },
  { id: "chene", name: "Chêne clair", hex: "#A87A50" },
  { id: "blanc", name: "Blanc", hex: "#F5F5F2" },
] as const;

export type WallColor = (typeof wallColors)[number];
export type AccentColor = (typeof accentColors)[number];
