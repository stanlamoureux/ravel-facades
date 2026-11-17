#!/usr/bin/env node
/**
 * Prépare les visuels du site à partir des photos sources.
 *
 * Les photos sources sont des images de démonstration générées avec Flux (kie.ai).
 * Ce script les recale (avant/après superposables au pixel), recolle le même ciel
 * sur les deux versions, découpe les cadrages utilisés par le site et calcule les
 * masques du nuancier (mur / volets / porte).
 *
 *   node scripts/images.mjs            -> ne fait rien si public/images est complet
 *   node scripts/images.mjs --force    -> régénère tout
 *   RAVEL_SRC_DIR=/chemin node ...     -> lit les sources en local (<nom>.webp|jpg|png)
 *
 * Quand le client fournit ses vraies photos : déposer les fichiers finaux dans
 * public/images avec les mêmes noms, ce script ne touchera plus à rien.
 */
import sharp from "sharp";
import { access, copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const OUT = "public/images";
const CACHES = [".next/cache/ravel-images-v4", "node_modules/.cache/ravel-images-v4"];
const LOCAL = process.env.RAVEL_SRC_DIR;
const FORCE = process.argv.includes("--force");

const KIE = "https://tempfile.aiquickdraw.com/js/p6/";
const SOURCES = Object.fromEntries(
  Object.entries({
    "m1-after": "71803f1ae26a",
    "m1-before": "7f66b6757c6e",
    "h1-after": "dc56e57ed39e",
    "h1-before": "c2f51dbd8cb4",
    "ba2-after": "94d4e6f373de",
    "ba2-before": "811c6f8faa62",
    "ba3-after": "53e95972c185",
    "ba3-before": "ca8b2f0e428a",
    "svc-ravalement": "49d783e523d2",
    "svc-nettoyage": "d88bc4899540",
    "svc-peinture": "3da0d244fee5",
    "t-hydrofuge": "c55d331ff666",
    "t-fissures": "94af3daa27dd",
    "t-ite": "6d9a1fd63ef9",
    "p-diagnostic": "18b79ce3e389",
    "p-echafaudage": "c1b5567547b4",
    "p-reception2": "4ce4f510b157",
    "g-meuliere": "3c319899a833",
    "g-contemporaine": "285eeb8f886f",
    "g-immeuble": "ffb73ffdf811",
    "g-pavillon": "2702d0a9852d",
    "g-longere": "5d1d32ced6bd",
    "equipe": "b1209985cc16",
  }).map(([name, id]) => [name, `${KIE}${id}.jpg`]),
);

const OUTPUTS = [
  "maison-avant.webp",
  "maison-apres.webp",
  "pavillon-avant.webp",
  "pavillon-apres.webp",
  "immeuble-avant.webp",
  "immeuble-apres.webp",
  "bourg-avant.webp",
  "bourg-apres.webp",
  "service-ravalement.webp",
  "service-nettoyage.webp",
  "service-peinture.webp",
  "prestation-hydrofuge.webp",
  "prestation-fissures.webp",
  "prestation-ite.webp",
  "etape-diagnostic.webp",
  "etape-preparation.webp",
  "etape-finition.webp",
  "etape-reception.webp",
  "realisation-meuliere.webp",
  "realisation-contemporaine.webp",
  "realisation-immeuble.webp",
  "realisation-pavillon.webp",
  "realisation-longere.webp",
  "equipe.webp",
  "nuancier.webp",
  "nuancier-masque.webp",
  "ciel.webp",
  "partage.jpg",
];

const exists = (p) => access(p).then(() => true, () => false);
const allIn = async (dir) => (await Promise.all(OUTPUTS.map((f) => exists(path.join(dir, f))))).every(Boolean);

/* ---------- lecture ---------- */

async function loadRGB(name, w, h) {
  let buf;
  if (LOCAL) {
    for (const ext of ["webp", "jpg", "png"]) {
      const p = path.join(LOCAL, `${name}.${ext}`);
      if (await exists(p)) {
        buf = await readFile(p);
        break;
      }
    }
    if (!buf) throw new Error(`Source locale introuvable : ${name}`);
  } else {
    for (let attempt = 1; !buf; attempt++) {
      try {
        const res = await fetch(SOURCES[name]);
        if (!res.ok) throw new Error(`réponse ${res.status}`);
        buf = Buffer.from(await res.arrayBuffer());
      } catch (e) {
        if (attempt === 3) throw new Error(`Téléchargement impossible de ${SOURCES[name]} (${e.message})`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  let img = sharp(buf).removeAlpha().toColourspace("srgb");
  if (w && h) img = img.resize(w, h, { fit: "fill", kernel: "lanczos3" });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

const fromRGB = (im) => sharp(im.data, { raw: { width: im.w, height: im.h, channels: 3 } });
const fromGray = (data, w, h) => sharp(Buffer.from(data.buffer, data.byteOffset, data.length), { raw: { width: w, height: h, channels: 1 } });

function crop(im, x0, y0, x1, y1) {
  const w = x1 - x0, h = y1 - y0;
  const out = Buffer.allocUnsafe(w * h * 3);
  for (let y = 0; y < h; y++) im.data.copy(out, y * w * 3, ((y + y0) * im.w + x0) * 3, ((y + y0) * im.w + x1) * 3);
  return { data: out, w, h };
}

/* ---------- géométrie : recalage de l'avant sur l'après ---------- */

/** dst(x, y) = src(M · [x, y, 1]) en bicubique, bords en miroir. M = [a, b, tx, c, d, ty]. */
function warpAffine(src, M) {
  const { data, w, h } = src;
  const out = Buffer.allocUnsafe(data.length);
  const refl = (v, n) => {
    if (v < 0) v = -v - 1;
    if (v >= n) v = 2 * n - v - 1;
    return v < 0 ? 0 : v >= n ? n - 1 : v;
  };
  const cub = (t) => {
    const a = -0.5, t2 = t * t, t3 = t2 * t;
    return [a * t3 - 2 * a * t2 + a * t, (a + 2) * t3 - (a + 3) * t2 + 1, -(a + 2) * t3 + (2 * a + 3) * t2 - a * t, -a * t3 + a * t2];
  };
  const xs = new Int32Array(4), ys = new Int32Array(4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = M[0] * x + M[1] * y + M[2], sy = M[3] * x + M[4] * y + M[5];
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      const wx = cub(sx - x0), wy = cub(sy - y0);
      for (let k = 0; k < 4; k++) {
        xs[k] = refl(x0 - 1 + k, w) * 3;
        ys[k] = refl(y0 - 1 + k, h) * w * 3;
      }
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < 4; j++) {
        let rr = 0, gg = 0, bb = 0;
        for (let i = 0; i < 4; i++) {
          const p = ys[j] + xs[i], wi = wx[i];
          rr += data[p] * wi;
          gg += data[p + 1] * wi;
          bb += data[p + 2] * wi;
        }
        r += rr * wy[j];
        g += gg * wy[j];
        b += bb * wy[j];
      }
      const o = (y * w + x) * 3;
      out[o] = r < 0 ? 0 : r > 255 ? 255 : r + 0.5;
      out[o + 1] = g < 0 ? 0 : g > 255 ? 255 : g + 0.5;
      out[o + 2] = b < 0 ? 0 : b > 255 ? 255 : b + 0.5;
    }
  }
  return { data: out, w, h };
}

/* ---------- masques ---------- */

/** HSV façon OpenCV : h 0..180, s et v 0..255. */
function hsv(r, g, b) {
  const v = Math.max(r, g, b), m = Math.min(r, g, b), d = v - m;
  const s = v === 0 ? 0 : (d * 255) / v;
  let h = 0;
  if (d !== 0) {
    if (v === r) h = (60 * (g - b)) / d;
    else if (v === g) h = 120 + (60 * (b - r)) / d;
    else h = 240 + (60 * (r - g)) / d;
    if (h < 0) h += 360;
  }
  return [h / 2, s, v];
}

function maskFrom(im, test) {
  const { data, w, h } = im;
  const m = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < m.length; i++, p += 3) m[i] = test(data[p], data[p + 1], data[p + 2], i % w, (i / w) | 0) ? 255 : 0;
  return m;
}

/** Érosion (min) ou dilatation (max) par un carré de côté 2r+1, séparable. */
function morph(m, w, h, r, max) {
  const pick = max ? Math.max : Math.min;
  const tmp = new Uint8Array(m.length), out = new Uint8Array(m.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let v = max ? 0 : 255;
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) v = pick(v, m[y * w + k]);
      tmp[y * w + x] = v;
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let v = max ? 0 : 255;
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) v = pick(v, tmp[k * w + x]);
      out[y * w + x] = v;
    }
  return out;
}
const erode = (m, w, h, r) => morph(m, w, h, r, false);
const dilate = (m, w, h, r) => morph(m, w, h, r, true);
const open = (m, w, h, r) => dilate(erode(m, w, h, r), w, h, r);
const close = (m, w, h, r) => erode(dilate(m, w, h, r), w, h, r);

/** Ne garde que les zones reliées à la première ligne de l'image. */
function connectedToTop(m, w, h) {
  const keep = new Uint8Array(m.length);
  const stack = [];
  for (let x = 0; x < w; x++) if (m[x]) { keep[x] = 255; stack.push(x); }
  while (stack.length) {
    const i = stack.pop(), x = i % w;
    if (x > 0 && m[i - 1] && !keep[i - 1]) { keep[i - 1] = 255; stack.push(i - 1); }
    if (x < w - 1 && m[i + 1] && !keep[i + 1]) { keep[i + 1] = 255; stack.push(i + 1); }
    if (i >= w && m[i - w] && !keep[i - w]) { keep[i - w] = 255; stack.push(i - w); }
    if (i + w < m.length && m[i + w] && !keep[i + w]) { keep[i + w] = 255; stack.push(i + w); }
  }
  return keep;
}

const blurMask = async (m, w, h, sigma) => new Uint8Array(await fromGray(m, w, h).blur(sigma).extractChannel(0).raw().toBuffer());

/**
 * Zone de ciel commune aux deux photos. On y recopie le ciel de l'après sur l'avant pour
 * que rien ne bouge dans le ciel quand on compare.
 *  - "blue"   : ciel bleu franc (teinte)
 *  - "clouds" : ciel bleu et nuages clairs, là où les deux photos se ressemblent déjà
 */
async function skyMask(after, before, mode) {
  const { w, h } = after;
  const A = after.data, B = before.data;
  const blue = (r, g, b) => {
    const [hh, s, v] = hsv(r, g, b);
    return hh > 88 && hh < 130 && s > 38 && v > 80;
  };
  const cloud = (r, g, b) => {
    const [, s, v] = hsv(r, g, b);
    return v > 150 && s < 70;
  };
  let m = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < m.length; i++, p += 3) {
    let ok = blue(A[p], A[p + 1], A[p + 2]);
    if (!ok && mode === "clouds") {
      const d = Math.max(Math.abs(A[p] - B[p]), Math.abs(A[p + 1] - B[p + 1]), Math.abs(A[p + 2] - B[p + 2]));
      ok = d < 45 && cloud(A[p], A[p + 1], A[p + 2]) && cloud(B[p], B[p + 1], B[p + 2]);
    }
    m[i] = ok ? 255 : 0;
  }
  m = close(open(m, w, h, 4), w, h, 4);
  m = erode(connectedToTop(m, w, h), w, h, 2);
  return blurMask(m, w, h, 2.5);
}

/* ---------- paire avant / après ---------- */

async function pair(name, size, M, sky = "blue") {
  const after = await loadRGB(`${name}-after`, ...size);
  const before = warpAffine(await loadRGB(`${name}-before`, ...size), M);
  if (sky === "none") return { after, before };
  const mask = await skyMask(after, before, sky);
  const a = after.data, b = before.data;
  for (let i = 0, p = 0; i < mask.length; i++, p += 3) {
    const t = mask[i] / 255;
    if (t === 0) continue;
    b[p] = a[p] * t + b[p] * (1 - t) + 0.5;
    b[p + 1] = a[p + 1] * t + b[p + 1] * (1 - t) + 0.5;
    b[p + 2] = a[p + 2] * t + b[p + 2] * (1 - t) + 0.5;
  }
  return { after, before };
}

const webp = (im, file, { width, quality = 86 } = {}) => {
  let s = fromRGB(im);
  if (width && width < im.w) s = s.resize({ width, kernel: "lanczos3" });
  return s.webp({ quality, effort: 6, smartSubsample: true }).toFile(path.join(OUT, file));
};

/* ---------- nuancier : photo + masques mur / volets / porte ---------- */

// Repères relevés sur la photo du nuancier (1200 x 1133). À refaire si la photo change.
const NU = {
  crop: [0, 1090, 1536, 2540], // dans la photo source 1536 x 2736
  width: 1200,
  wall: { x0: 58, y0: 198, y1: 946, notch: [1160, 640] }, // le muret blanc en bas à droite n'est pas la façade
  shutterCols: [[152, 226], [415, 490], [793, 862], [1049, 1122]],
  shutterRows: [[[274, 481], [278, 481]], [[642, 849], [642, 849]]], // [rangée][fenêtre gauche, droite]
  windows: [[252, 289, 402, 482], [871, 289, 1016, 482], [253, 646, 402, 842], [871, 646, 1016, 842]],
  door: [561, 647, 688, 937],
};

async function nuancier(source, width = NU.width) {
  const c = crop(source, ...NU.crop);
  const { data, info } = await fromRGB(c).resize({ width, kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const im = { data, w: info.width, h: info.height };
  const { w, h } = im;
  const k = width / NU.width; // les repères sont donnés pour une image de 1200 px de large
  const inRect = (x, y, [x0, y0, x1, y1], pad = 0) => x >= x0 * k - pad && x <= x1 * k + pad && y >= y0 * k - pad && y <= y1 * k + pad;

  const shutterRects = [];
  NU.shutterRows.forEach((row) => row.forEach(([y0, y1], k) => [0, 1].forEach((j) => shutterRects.push([NU.shutterCols[k * 2 + j][0], y0, NU.shutterCols[k * 2 + j][1], y1]))));

  let shutters = maskFrom(im, (r, g, b, x, y) => {
    if (!shutterRects.some((R) => inRect(x, y, R, 1))) return false;
    const [hh, s, v] = hsv(r, g, b);
    return (hh >= 50 && hh <= 105 && s > 30) || v < 80;
  });
  shutters = close(open(shutters, w, h, 1), w, h, 2);

  let door = maskFrom(im, (r, g, b, x, y) => {
    if (!inRect(x, y, NU.door)) return false;
    const [hh, , v] = hsv(r, g, b);
    return !(v > 150 && hh < 40); // boîte aux lettres en laiton, reflets chauds des vitres
  });
  door = close(open(door, w, h, 1), w, h, 2);

  const nearShutter = dilate(shutters, w, h, 1);
  let wall = maskFrom(im, (r, g, b, x, y) => {
    const W = NU.wall;
    if (x < W.x0 * k || y < W.y0 * k || y > W.y1 * k) return false;
    if (x > W.notch[0] * k && y > W.notch[1] * k) return false;
    if (nearShutter[y * w + x]) return false;
    if (inRect(x, y, NU.door, 1) || NU.windows.some((R) => inRect(x, y, R))) return false;
    const [hh, s, v] = hsv(r, g, b);
    if (v < 62) return false; // ferrures, ombres profondes
    if (s > 105 && v < 185) return false; // feuillages, tuiles, bois
    if (hh > 32 && hh < 100 && s > 50) return false; // végétation
    return true;
  });
  wall = close(open(wall, w, h, 1), w, h, 2);

  const [mw, ms, md] = await Promise.all([blurMask(wall, w, h, 0.7), blurMask(shutters, w, h, 0.7), blurMask(door, w, h, 0.7)]);
  const mask = Buffer.allocUnsafe(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    mask[i * 3] = mw[i];
    mask[i * 3 + 1] = ms[i];
    mask[i * 3 + 2] = md[i];
  }

  // Couleurs de référence : c'est par rapport à elles que l'éclairage de chaque pixel est mesuré.
  const quantile = (values, q) => values.sort((a, b) => a - b)[Math.floor(values.length * q)];
  const luma = (i) => 0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2];
  const pick = (m, f) => {
    const out = [];
    for (let i = 0; i < m.length; i += 3) if (m[i]) out.push(f(i));
    return out;
  };
  const refs = {
    wall: [0, 1, 2].map((ch) => quantile(pick(wall, (i) => data[i * 3 + ch]), 0.5)),
    shutter: Math.round(quantile(pick(shutters, luma), 0.9)),
    door: Math.round(quantile(pick(door, luma), 0.5)),
  };
  return { im, mask, refs };
}

/* ---------- programme ---------- */

async function generate() {
  await mkdir(OUT, { recursive: true });
  const plain = async (name, size, file, opts = {}) => {
    const im = await loadRGB(name, ...size);
    return webp(opts.crop ? crop(im, ...opts.crop) : im, file, { width: opts.width, quality: opts.quality ?? 82 });
  };

  // Maison de ville (portrait) : le hero. Les matrices viennent d'un recalage ECC sur les contours.
  const m1 = await pair("m1", [1536, 2736], [1.003583, 8.67756e-5, 7.59067, 2.300097e-4, 1.036024, -88.73768]);
  const m1Bottom = 2612; // coupe le marquage au sol illisible en bas de l'image
  await webp(crop(m1.after, 0, 0, 1536, m1Bottom), "maison-apres.webp");
  await webp(crop(m1.before, 0, 0, 1536, m1Bottom), "maison-avant.webp");
  await webp(crop(m1.after, 0, 250, 1536, 1420), "ciel.webp", { quality: 82 });
  await webp(crop(m1.after, 990, 1380, 1470, 1740), "etape-finition.webp", { quality: 84 });

  // Nuancier : la même maison, cadrée sur la façade, avec ses masques.
  const nu = await nuancier(m1.after);
  await webp(nu.im, "nuancier.webp", { quality: 88 });
  await sharp(nu.mask, { raw: { width: nu.im.w, height: nu.im.h, channels: 3 } }).webp({ lossless: true, effort: 6 }).toFile(path.join(OUT, "nuancier-masque.webp"));
  console.log("images : références du nuancier", JSON.stringify(nu.refs), `${nu.im.w} x ${nu.im.h}`);

  // Les trois chantiers du comparateur avant / après.
  const h1 = await pair("h1", [2400, 1347], [1.002367, 1.760359e-3, 2.378514, -3.48081e-5, 0.9971027, -2.886626]);
  await webp(h1.after, "pavillon-apres.webp", { width: 2000, quality: 84 });
  await webp(h1.before, "pavillon-avant.webp", { width: 2000, quality: 84 });
  const ba2 = await pair("ba2", [2000, 1338], [0.99765491, 1.245804e-4, 4.0645795, -2.9419028e-4, 0.99995303, -3.1208005], "none");
  await webp(ba2.after, "immeuble-apres.webp", { width: 1800 });
  await webp(ba2.before, "immeuble-avant.webp", { width: 1800 });
  const ba3 = await pair("ba3", [2000, 1338], [0.99573642, -1.5657641e-3, 13.992669, 2.5361299e-4, 0.99818975, 3.9975655], "clouds");
  await webp(ba3.after, "bourg-apres.webp", { width: 1800 });
  await webp(ba3.before, "bourg-avant.webp", { width: 1800 });

  // Image de partage (réseaux sociaux) : moitié avant, moitié après.
  const W = 2400, top = 60, hh = 1260;
  const share = crop(h1.after, 0, top, W, top + hh);
  const left = crop(h1.before, 0, top, W / 2, top + hh);
  for (let y = 0; y < hh; y++) left.data.copy(share.data, y * W * 3, y * left.w * 3, (y + 1) * left.w * 3);
  const line = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="598.5" width="3" height="630" fill="#fff"/></svg>`);
  await fromRGB(share).resize(1200, 630, { fit: "cover" }).composite([{ input: line }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, "partage.jpg"));

  // Prestations : les trois métiers en situation, et trois vignettes.
  await plain("svc-ravalement", [1100, 1467], "service-ravalement.webp", { crop: [0, 30, 1100, 1405] });
  await plain("svc-nettoyage", [880, 1184], "service-nettoyage.webp", { crop: [0, 60, 880, 1160] });
  await plain("svc-peinture", [1100, 1467], "service-peinture.webp", { crop: [0, 60, 1100, 1435] });
  await plain("t-hydrofuge", [720, 720], "prestation-hydrofuge.webp", { width: 480 });
  await plain("t-fissures", [720, 720], "prestation-fissures.webp", { width: 480 });
  await plain("t-ite", [720, 720], "prestation-ite.webp", { width: 480 });

  // Les étapes d'un chantier.
  await plain("p-diagnostic", [1024, 761], "etape-diagnostic.webp");
  await plain("p-echafaudage", [1024, 761], "etape-preparation.webp");
  await plain("p-reception2", [1024, 761], "etape-reception.webp");

  // Réalisations et équipe.
  for (const n of ["meuliere", "contemporaine", "immeuble", "pavillon"]) await plain(`g-${n}`, [1100, 1467], `realisation-${n}.webp`);
  await plain("g-longere", [1600, 1070], "realisation-longere.webp");
  await plain("equipe", [1600, 1070], "equipe.webp");
}

async function main() {
  if (!FORCE && (await allIn(OUT))) return console.log("images : déjà prêtes");
  if (!FORCE)
    for (const c of CACHES)
      if (await allIn(c)) {
        await mkdir(OUT, { recursive: true });
        await Promise.all(OUTPUTS.map((f) => copyFile(path.join(c, f), path.join(OUT, f))));
        return console.log(`images : reprises du cache (${c})`);
      }
  const t = Date.now();
  await generate();
  for (const c of CACHES) {
    try {
      await mkdir(c, { recursive: true });
      await Promise.all(OUTPUTS.map((f) => copyFile(path.join(OUT, f), path.join(c, f))));
    } catch {}
  }
  console.log(`images : générées en ${((Date.now() - t) / 1000).toFixed(1)} s`);
}


if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error("images : échec -", e.message);
    process.exit(1);
  });
}
