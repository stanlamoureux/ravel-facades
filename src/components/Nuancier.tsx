"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { accentColors, wallColors, type AccentColor, type WallColor } from "@/config/offer";
import { useQuote } from "./QuoteContext";
import { Check } from "./icons";

/**
 * Nuancier sur photo réelle.
 *
 * La photo est recolorée pixel par pixel dans un canvas : pour chaque pixel du mur on garde
 * son éclairage (ombres, lumière dorée, grain de l'enduit) et on remplace seulement la teinte.
 * Les zones viennent d'un masque (rouge = mur, vert = volets, bleu = porte) et les constantes
 * ci-dessous des couleurs de référence mesurées sur la photo. Les deux sont produits par
 * scripts/images.mjs : à régénérer ensemble si la photo change.
 */
const W = 1200;
const H = 1133;
const REF = { wall: [244, 220, 188], shutter: 85, door: 20 };
const TINT = [1, 0.965, 0.92];
const PHOTO = "/images/nuancier.webp";
const MASK = "/images/nuancier-masque.webp";

type Zone = { idx: Uint32Array; a: Float32Array; k?: Float32Array };
type Engine = { base: Uint8ClampedArray; wall: Zone; shutters: Zone; door: Zone; next: HTMLCanvasElement };

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function pixels(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, W, H);
  return ctx.getImageData(0, 0, W, H).data;
}

async function buildEngine(): Promise<Engine> {
  const [photo, mask] = await Promise.all([loadImage(PHOTO), loadImage(MASK)]);
  const base = pixels(photo);
  const m = pixels(mask);
  const zone = (channel: number, gain?: (luma: number) => number): Zone => {
    let n = 0;
    for (let i = channel; i < m.length; i += 4) if (m[i] > 3) n++;
    const idx = new Uint32Array(n), a = new Float32Array(n), k = gain ? new Float32Array(n) : undefined;
    for (let i = 0, j = 0; i < W * H; i++) {
      const v = m[i * 4 + channel];
      if (v <= 3) continue;
      idx[j] = i * 4;
      a[j] = v / 255;
      if (k && gain) k[j] = gain(0.2126 * base[i * 4] + 0.7152 * base[i * 4 + 1] + 0.0722 * base[i * 4 + 2]);
      j++;
    }
    return { idx, a, k };
  };
  const next = document.createElement("canvas");
  next.width = W;
  next.height = H;
  return {
    base,
    wall: zone(0),
    shutters: zone(1, (L) => Math.pow(Math.min(1.25, L / REF.shutter), 0.75)),
    door: zone(2, (L) => Math.min(1, 0.55 * Math.sqrt(Math.min(3.3, L / REF.door)))),
    next,
  };
}

/** Calcule la photo dans les teintes demandées (null = teinte d'origine). */
function render(e: Engine, wallHex: string | null, accentHex: string | null) {
  const out = new ImageData(W, H);
  const d = out.data;
  d.set(e.base);
  if (wallHex) {
    const c = rgb(wallHex).map((v, i) => (v * TINT[i]) / REF.wall[i]);
    const { idx, a } = e.wall;
    for (let j = 0; j < idx.length; j++) {
      const p = idx[j], t = a[j];
      d[p] += (Math.min(255, d[p] * c[0]) - d[p]) * t;
      d[p + 1] += (Math.min(255, d[p + 1] * c[1]) - d[p + 1]) * t;
      d[p + 2] += (Math.min(255, d[p + 2] * c[2]) - d[p + 2]) * t;
    }
  }
  if (accentHex) {
    const c = rgb(accentHex);
    for (const z of [e.shutters, e.door]) {
      const { idx, a, k } = z;
      for (let j = 0; j < idx.length; j++) {
        const p = idx[j], t = a[j], g = k![j];
        d[p] += (Math.min(255, c[0] * g) - d[p]) * t;
        d[p + 1] += (Math.min(255, c[1] * g) - d[p + 1]) * t;
        d[p + 2] += (Math.min(255, c[2] * g) - d[p + 2]) * t;
      }
    }
  }
  return out;
}

export function Nuancier() {
  const [wall, setWall] = useState<WallColor>(wallColors[0]);
  const [accent, setAccent] = useState<AccentColor>(accentColors[0]);
  const [live, setLive] = useState(false);
  const [other, setOther] = useState(false); // le client demande une teinte absente du nuancier
  const [otherText, setOtherText] = useState("");
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  const raf = useRef(0);
  const { goToQuote } = useQuote();

  const paint = useCallback((w: WallColor, a: AccentColor, instant = false) => {
    const e = engine.current, cv = canvas.current;
    if (!e || !cv) return;
    const ctx = cv.getContext("2d")!;
    const img = render(e, w.id === wallColors[0].id ? null : w.hex, a.id === accentColors[0].id ? null : a.hex);
    cancelAnimationFrame(raf.current);
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return ctx.putImageData(img, 0, 0);
    // fondu : la nouvelle image vient recouvrir l'ancienne en quelques images
    e.next.getContext("2d")!.putImageData(img, 0, 0);
    let frame = 0;
    const step = () => {
      frame++;
      ctx.globalAlpha = frame >= 9 ? 1 : 0.32;
      ctx.drawImage(e.next, 0, 0);
      ctx.globalAlpha = 1;
      if (frame < 9) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  // le moteur ne se charge qu'à l'approche de la section
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        buildEngine()
          .then((e) => {
            if (cancelled) return;
            engine.current = e;
            setLive(true);
          })
          .catch(() => {});
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const first = useRef(true);
  useEffect(() => {
    if (!live) return;
    paint(wall, accent, first.current);
    first.current = false;
  }, [live, wall, accent, paint]);

  return (
    <section ref={section} id="teintes" className="py-14 md:py-[min(8rem,12svh)]" aria-labelledby="teintes-title">
      <div className="wrap grid gap-x-16 gap-y-6 md:gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-y-10">
        <div className="lg:col-start-2 lg:row-start-1 lg:pt-4">
          <h2 id="teintes-title" className="t-h2 max-w-[12ch]">
            Et dans une autre teinte ?
          </h2>
          <p className="t-lede mt-4 max-w-[38ch] md:mt-6">Essayez les teintes de notre nuancier sur une vraie façade. Les ombres et la lumière restent celles de la photo.</p>
        </div>

        <div className="sticky top-[120px] z-10 -mx-5 aspect-[4/3] overflow-hidden bg-gris shadow-[0_10px_24px_-14px_rgb(14_26_38/0.45)] md:relative md:z-auto md:mx-0 md:aspect-[1200/1133] lg:max-h-[calc(100svh-170px)] md:rounded-[32px] md:shadow-none lg:col-start-1 lg:row-span-2 lg:row-start-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- même fichier que celui lu par le canvas : un seul téléchargement */}
          <img src={PHOTO} alt={`Façade de maison de ville, enduit ${wall.name.toLowerCase()}, volets ${accent.name.toLowerCase()}`} width={W} height={H} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_62%] md:object-center" />
          <canvas ref={canvas} width={W} height={H} className={`absolute inset-0 h-full w-full object-cover object-[50%_62%] md:object-center ${live ? "opacity-100" : "opacity-0"}`} aria-hidden />
          <p className="glass absolute bottom-4 left-4 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-[600] text-white md:bottom-6 md:left-6" aria-live="polite">
            {wall.name}, volets {accent.name.toLowerCase()}
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <Swatches legend="Façade" detail={`${wall.name}, ${wall.ref}`} options={wallColors} value={wall.id} onChange={(c) => setWall(c)} cols={8} />
          <div className="mt-6 md:mt-8">
            <Swatches legend="Volets et porte" detail={accent.name} options={accentColors} value={accent.id} onChange={(c) => setAccent(c)} cols={8} />
          </div>
          <div className="mt-6 rounded-[20px] bg-gris p-4 md:mt-8">
            <button type="button" className="flex w-full items-center gap-3 text-left" aria-expanded={other} onClick={() => setOther((o) => !o)}>
              <span
                className="h-9 w-9 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(14_26_38/0.14)]"
                style={{ background: "conic-gradient(from 200deg, #d8c3a5, #b4583a, #6f7f5b, #4f6d8a, #8a6f9e, #e2b04a, #d8c3a5)" }}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-[620]">Votre teinte n&apos;est pas dans la liste&nbsp;?</span>
                <span className="block text-[0.875rem] text-ardoise">Indiquez-la, on vous apporte l&apos;échantillon.</span>
              </span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[1.25rem] leading-none transition-transform duration-200 ${other ? "rotate-45" : ""}`} aria-hidden>
                +
              </span>
            </button>
            {other && (
              <input
                className="field mt-3"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Nom, référence ou description de la teinte"
                aria-label="Teinte souhaitée"
                maxLength={100}
                autoFocus
              />
            )}
          </div>
          <button
            type="button"
            className="btn btn-ink mt-6 w-full md:mt-8 md:w-auto"
            onClick={() =>
              goToQuote({
                works: ["Peinture"],
                color: other && otherText.trim() ? `${otherText.trim()} (hors nuancier)` : `${wall.name} (${wall.ref})`,
                accent: accent.name,
                source: "nuancier",
              })
            }
          >
            {other && otherText.trim() ? "Demander un essai de ma teinte" : "Demander un essai de cette teinte"}
          </button>
          <p className="mt-4 max-w-[46ch] text-[0.875rem] leading-[1.5] text-ardoise">Le rendu à l&apos;écran reste indicatif. Avant tout chantier, nous posons un essai de la teinte sur votre mur.</p>
        </div>
      </div>
    </section>
  );
}

function Swatches<T extends { id: string; name: string; hex: string }>({
  legend,
  detail,
  options,
  value,
  onChange,
  cols,
}: {
  legend: string;
  detail: string;
  options: readonly T[];
  value: string;
  onChange: (c: T) => void;
  cols: number;
}) {
  return (
    <div role="radiogroup" aria-label={legend}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="t-label">{legend}</span>
        <span className="text-[0.9375rem] text-ardoise">{detail}</span>
      </div>
      <div className="mt-3 grid gap-y-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((c) => {
          const on = c.id === value;
          return (
            <label key={c.id} className="group relative grid aspect-square max-h-14 cursor-pointer place-items-center" title={c.name}>
              <input type="radio" name={legend} className="peer sr-only" checked={on} onChange={() => onChange(c)} aria-label={c.name} />
              <span
                className="grid h-9 w-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(14_26_38/0.14)] transition-[transform,box-shadow] duration-200 group-hover:scale-105 peer-checked:shadow-[inset_0_0_0_1px_rgb(14_26_38/0.14),0_0_0_3px_#fff,0_0_0_5px_var(--color-encre)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[7px] peer-focus-visible:outline-ciel md:h-10 md:w-10"
                style={{ background: c.hex }}
              >
                {on && <Check className={`h-4 w-4 ${luminance(c.hex) > 0.55 ? "text-encre" : "text-white"}`} />}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function luminance(hex: string) {
  const [r, g, b] = rgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
