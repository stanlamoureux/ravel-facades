import { z } from "zod";
import { leadSchema } from "./lead";

/** Créneaux proposés pour être rappelé. */
export const SLOTS = ["Dès que possible", "Le matin", "Entre midi et deux", "En fin de journée"] as const;

/** Demande de rappel depuis une fiche prestation : un nom, un numéro, un créneau. Rien de plus. */
export const callbackSchema = z.object({
  service: z.string().min(2).max(80),
  name: leadSchema.shape.name,
  phone: leadSchema.shape.phone,
  slot: z.enum(SLOTS),
  consent: z.literal(true, { message: "Votre accord est nécessaire pour être rappelé" }),
  source: z.string().max(60).optional().default(""),
  page: z.string().max(500).optional().default(""),
  website: z.string().max(0).optional().default(""), // pot de miel anti-robots
  startedAt: z.number().optional(),
});

export type CallbackRequest = z.output<typeof callbackSchema>;
