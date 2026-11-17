/** Géométrie des 3 types de bâtiments, dans un viewBox commun de 800 x 620. */

export type Variant = "pavillon" | "maison" | "immeuble";

export type Rect = { x: number; y: number; w: number; h: number };
export type Win = Rect & { shutters: boolean; railing: boolean };
export type Door = Rect & { arched?: boolean; transom?: boolean };

export type Spec = {
  label: string;
  wall: Rect;
  originalWall: string;
  base: number; // hauteur du soubassement
  bands: number[]; // y des bandeaux entre étages
  windows: Win[];
  door: Door;
  roof: { kind: "tiles" | "slate" | "zinc"; points: string; dormers: Rect[]; chimneys: Rect[] };
  balconies: { y: number }[];
  plants: boolean;
  cracks: { d: string; cx: number; cy: number; label: string }[];
  moisture: { x: number; y: number };
  dims: { width: string; height: string; surface: string };
  /** cadrage serré (viewBox) pour l'affichage hors hero */
  frame: string;
};

const GROUND = 560;

function pavillon(): Spec {
  const wall = { x: 120, y: 262, w: 560, h: GROUND - 262 };
  const cols = [213, 400, 587];
  const windows: Win[] = [];
  for (const cx of cols) windows.push({ x: cx - 35, y: 292, w: 70, h: 94, shutters: true, railing: false });
  windows.push({ x: cols[0] - 35, y: 432, w: 70, h: 84, shutters: true, railing: false });
  windows.push({ x: cols[2] - 35, y: 432, w: 70, h: 84, shutters: true, railing: false });
  return {
    label: "Pavillon",
    wall,
    originalWall: "#D8D1C3",
    base: 30,
    bands: [412],
    windows,
    door: { x: 361, y: 418, w: 78, h: GROUND - 418, transom: true },
    roof: {
      kind: "tiles",
      points: "94,264 706,264 620,146 180,146",
      dormers: [],
      chimneys: [{ x: 532, y: 108, w: 38, h: 70 }],
    },
    balconies: [],
    plants: true,
    cracks: [
      { d: "M622 392 l7 12 l-3 9 l9 13 l-2 10 l8 13", cx: 628, cy: 420, label: "Fissure 1,5 mm" },
      { d: "M176 512 l5 -11 l-4 -9 l6 -13 l-2 -8", cx: 178, cy: 492, label: "Microfissure" },
    ],
    moisture: { x: 300, y: 545 },
    dims: { width: "11,20 m", height: "6,40 m", surface: "142 m²" },
    frame: "40 84 720 512",
  };
}

function maison(): Spec {
  const wall = { x: 250, y: 186, w: 300, h: GROUND - 186 };
  const cols = [325, 475];
  const windows: Win[] = [];
  for (const top of [204, 328]) for (const cx of cols) windows.push({ x: cx - 31, y: top, w: 62, h: 94, shutters: true, railing: true });
  windows.push({ x: cols[1] - 31, y: 456, w: 62, h: 70, shutters: true, railing: false });
  return {
    label: "Maison de ville",
    wall,
    originalWall: "#D6CDBD",
    base: 26,
    bands: [312, 436],
    windows,
    door: { x: cols[0] - 34, y: 440, w: 68, h: GROUND - 440, transom: true },
    roof: {
      kind: "slate",
      points: "236,188 564,188 530,96 270,96",
      dormers: [{ x: 370, y: 108, w: 60, h: 64 }],
      chimneys: [{ x: 498, y: 66, w: 30, h: 46 }],
    },
    balconies: [],
    plants: false,
    cracks: [
      { d: "M520 312 l-6 10 l4 9 l-7 12 l3 9 l-6 11", cx: 514, cy: 338, label: "Fissure 2 mm" },
      { d: "M268 420 l6 -10 l-3 -9 l5 -10", cx: 272, cy: 404, label: "Microfissure" },
    ],
    moisture: { x: 470, y: 548 },
    dims: { width: "6,10 m", height: "8,20 m", surface: "96 m²" },
    frame: "70 44 660 552",
  };
}

function immeuble(): Spec {
  const wall = { x: 110, y: 152, w: 580, h: GROUND - 152 };
  const cols = [168, 284, 400, 516, 632];
  const floorTops = [152, 234, 316, 398]; // étages 4 -> 1
  const windows: Win[] = [];
  floorTops.forEach((top, i) => {
    for (const cx of cols) windows.push({ x: cx - 25, y: top + 12, w: 50, h: 62, shutters: false, railing: i !== 0 && i !== 2 });
  });
  for (const cx of [168, 284, 516, 632]) windows.push({ x: cx - 32, y: 494, w: 64, h: 52, shutters: false, railing: false });
  return {
    label: "Immeuble",
    wall,
    originalWall: "#DCD2BF",
    base: 34,
    bands: [234, 316, 398, 480],
    windows,
    door: { x: 368, y: 488, w: 64, h: GROUND - 488, arched: true },
    roof: {
      kind: "zinc",
      points: "96,154 704,154 664,74 136,74",
      dormers: cols.map((cx) => ({ x: cx - 18, y: 92, w: 36, h: 44 })),
      chimneys: [
        { x: 190, y: 46, w: 26, h: 40 },
        { x: 586, y: 46, w: 26, h: 40 },
      ],
    },
    balconies: [{ y: 152 + 12 + 62 }, { y: 316 + 12 + 62 }],
    plants: false,
    cracks: [
      { d: "M455 400 l6 10 l-2 8 l7 11 l-3 9 l6 10", cx: 460, cy: 424, label: "Fissure 1 mm" },
      { d: "M672 300 l-5 9 l3 8 l-6 10", cx: 670, cy: 314, label: "Microfissure" },
    ],
    moisture: { x: 250, y: 545 },
    dims: { width: "18,40 m", height: "17,60 m", surface: "324 m²" },
    frame: "40 26 720 570",
  };
}

export const specs: Record<Variant, Spec> = {
  pavillon: pavillon(),
  maison: maison(),
  immeuble: immeuble(),
};

export const GROUND_Y = GROUND;

/** Petit générateur pseudo-aléatoire déterministe (même rendu serveur / client). */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
