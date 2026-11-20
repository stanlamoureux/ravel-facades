import { z } from "zod";

export const WORK_OPTIONS = ["Ravalement", "Peinture", "Nettoyage de façade", "Boiseries et volets", "Dalles et murets", "Hydrofuge", "Fissures", "ITE", "Je ne sais pas encore"] as const;
export const PROPERTY_OPTIONS = ["Maison", "Maison mitoyenne", "Immeuble", "Local professionnel"] as const;
export const TIMELINE_OPTIONS = ["Dès que possible", "Dans 1 à 3 mois", "Dans plus de 3 mois", "Je me renseigne"] as const;

const phoneRe = /^(?:(?:\+|00)33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const leadSchema = z.object({
  works: z.array(z.string().max(60)).min(1, "Choisissez au moins une prestation").max(10),
  property: z.string().max(60).optional().default(""),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres"),
  surface: z.number().int().min(0).max(100000).optional(),
  timeline: z.string().max(60).optional().default(""),
  color: z.string().max(120).optional().default(""),
  accent: z.string().max(120).optional().default(""),
  estimateLow: z.number().int().min(0).max(10_000_000).optional(),
  estimateHigh: z.number().int().min(0).max(10_000_000).optional(),
  name: z.string().trim().min(2, "Indiquez votre nom").max(120),
  phone: z.string().trim().regex(phoneRe, "Numéro de téléphone français à 10 chiffres"),
  email: z.union([z.literal(""), z.string().trim().email("Adresse email invalide").max(200)]).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true, { message: "Votre accord est nécessaire pour être recontacté" }),
  source: z.string().max(60).optional().default(""),
  page: z.string().max(500).optional().default(""),
  utm: z.record(z.string(), z.string().max(200)).optional().default({}),
  website: z.string().max(0).optional().default(""), // pot de miel anti-robots
  startedAt: z.number().optional(),
});

/** Demande d'estimation depuis le simulateur : l'email est obligatoire, c'est là que part le chiffre. */
export const estimateSchema = z.object({
  work: z.string().max(40),
  property: z.string().max(40),
  condition: z.string().max(40),
  height: z.string().max(40),
  surface: z.number().int().min(20).max(5000),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres"),
  name: z.string().trim().min(2, "Indiquez votre nom").max(120),
  email: z.string().trim().email("Adresse email invalide").max(200),
  phone: z.string().trim().regex(phoneRe, "Numéro de téléphone français à 10 chiffres"),
  consent: z.literal(true, { message: "Votre accord est nécessaire pour recevoir l'estimation" }),
  page: z.string().max(500).optional().default(""),
  utm: z.record(z.string(), z.string().max(200)).optional().default({}),
  website: z.string().max(0).optional().default(""), // pot de miel anti-robots
  startedAt: z.number().optional(),
});

export type EstimateRequest = z.output<typeof estimateSchema>;
export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
