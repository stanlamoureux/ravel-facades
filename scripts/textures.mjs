// Génère les textures de la façade (crasse + grain d'enduit) en PNG, sans dépendance.
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

mkdirSync("public/textures", { recursive: true });

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
function valueNoise(w, h, cell, seed, wrap = false) {
  const r = rng(seed); const gw = Math.ceil(w / cell) + 1, gh = Math.ceil(h / cell) + 1;
  const g = Array.from({ length: gh }, () => Array.from({ length: gw }, r));
  if (wrap) { for (let y = 0; y < gh; y++) g[y][gw - 1] = g[y][0]; for (let x = 0; x < gw; x++) g[gh - 1][x] = g[0][x]; }
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const gx = x / cell, gy = y / cell, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = s(gx - x0), fy = s(gy - y0);
    const a = g[y0][x0], b = g[y0][x0 + 1], c = g[y0 + 1][x0], d = g[y0 + 1][x0 + 1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}
// 1) Crasse : grandes taches sombres irrégulières, alpha variable
{
  const W = 400, H = 320; const n = [valueNoise(W, H, 80, 7), valueNoise(W, H, 36, 11), valueNoise(W, H, 14, 23), valueNoise(W, H, 5, 41)];
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = n[0](x, y) * 0.5 + n[1](x, y) * 0.28 + n[2](x, y) * 0.14 + n[3](x, y) * 0.08;
    // plus sale vers le bas et en haut (ruissellement)
    const vy = y / H; v += 0.18 * Math.pow(vy, 2.2) + 0.1 * Math.pow(1 - vy, 6);
    let a = Math.min(1, Math.max(0, (v - 0.38) * 1.9));
    const i = (y * W + x) * 4; buf[i] = 58; buf[i + 1] = 56; buf[i + 2] = 44; buf[i + 3] = Math.round(a * 255);
  }
  writeFileSync("public/textures/grime.png", png(W, H, buf));
}
// 2) Grain d'enduit (crépi) : tuile répétable 160x160, points clairs et sombres
{
  const W = 160, H = 160; const r = rng(99); const n = valueNoise(W, H, 4, 5, true);
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = n(x % W, y % H) * 0.6 + r() * 0.4; const i = (y * W + x) * 4;
    const dark = v < 0.5; const a = Math.abs(v - 0.5) * 2;
    buf[i] = dark ? 40 : 255; buf[i + 1] = dark ? 38 : 255; buf[i + 2] = dark ? 32 : 252; buf[i + 3] = Math.round(Math.pow(a, 1.6) * (dark ? 70 : 60));
  }
  writeFileSync("public/textures/crepi.png", png(W, H, buf));
}
console.log("ok");
