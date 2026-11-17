/**
 * Prix - DONNÉES TEST, à remplacer par la grille du client.
 *
 * Ce fichier n'est importé que par le serveur (route /api/estimation) : aucun prix
 * n'arrive dans le navigateur. Le visiteur reçoit son estimation par email, une fois
 * ses coordonnées laissées.
 */
import type { ConditionId, HeightId, PropertyId, WorkId } from "./offer";

/** Fourchette TTC au m² de façade, par type de travaux. */
const perM2: Record<WorkId, [number, number]> = {
  nettoyage: [18, 32],
  "nettoyage-hydrofuge": [28, 48],
  peinture: [38, 65],
  ravalement: [60, 110],
  ite: [140, 210],
};

const byProperty: Record<PropertyId, number> = { maison: 1, mitoyenne: 0.96, immeuble: 1.08 };
const byCondition: Record<ConditionId, number> = { bon: 1, moyen: 1.12, degrade: 1.3 };
const byHeight: Record<HeightId, number> = { rdc: 0.92, r1: 1, r2: 1.15 };

/** Montant plancher d'un chantier (déplacement, installation). */
const MIN_JOB = 1500;

export type EstimateInput = { surface: number; work: WorkId; property: PropertyId; condition: ConditionId; height: HeightId };

export function estimate(o: EstimateInput) {
  const factor = byProperty[o.property] * byCondition[o.condition] * byHeight[o.height];
  const round = (n: number) => Math.round(n / 100) * 100;
  const [min, max] = perM2[o.work];
  return {
    low: Math.max(MIN_JOB, round(o.surface * min * factor)),
    high: Math.max(MIN_JOB + 600, round(o.surface * max * factor)),
  };
}
