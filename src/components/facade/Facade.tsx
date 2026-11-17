"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useMemo } from "react";
import { specs, seeded, GROUND_Y, type Variant, type Win } from "./specs";

type Color = string | MotionValue<string>;

export type FacadeProps = {
  variant: Variant;
  /** 0 = sale, 1 = entièrement nettoyée (balayage gauche -> droite) */
  clean: MotionValue<number>;
  /** 0 -> 1 : fissures rebouchées, hydrofuge (perles d'eau, reflet) */
  protect: MotionValue<number>;
  /** 0 -> 1 : peinture appliquée de haut en bas */
  paint: MotionValue<number>;
  /** 0 -> 1 : visibilité des cotes de diagnostic */
  diag?: MotionValue<number>;
  /** 0 -> 1 : ligne de scan du diagnostic */
  scan?: MotionValue<number>;
  wallColor: Color;
  accentColor: Color;
  className?: string;
  title?: string;
  showTools?: boolean;
  viewBox?: string;
};

const INK = "#1A1E24";
const BLUE = "#2A3FF5";

export function Facade({
  variant,
  clean,
  protect,
  paint,
  diag,
  scan,
  wallColor,
  accentColor,
  className,
  title,
  showTools = true,
  viewBox = "0 0 800 620",
}: FacadeProps) {
  const s = specs[variant];
  const raw = useId();
  const uid = "f" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  const { wall } = s;

  // ---------- valeurs animées ----------
  const dirtX = useTransform(clean, (v) => wall.x + v * wall.w);
  const dirtW = useTransform(clean, (v) => Math.max(0, wall.w - v * wall.w + 40));
  const sprayX = useTransform(clean, (v) => wall.x + v * wall.w - 34);
  const sprayOpacity = useTransform(clean, (v) => (v > 0.002 && v < 0.995 ? 1 : 0));
  const paintH = useTransform(paint, (v) => v * (GROUND_Y - wall.y + 2));
  const rollerY = useTransform(paint, (v) => wall.y + v * (GROUND_Y - wall.y) - 9);
  const rollerOpacity = useTransform(paint, (v) => (v > 0.003 && v < 0.995 ? 1 : 0));
  const crackOpacity = useTransform(protect, [0, 0.45], [1, 0]);
  const dropsOpacity = useTransform(protect, [0.15, 0.5, 0.85, 1], [0, 1, 0.9, 0]);
  const sheenX = useTransform(protect, (v) => wall.x - 260 + v * (wall.w + 420));
  const sheenOpacity = useTransform(protect, [0, 0.1, 0.9, 1], [0, 0.85, 0.85, 0]);
  const fallback = useMotionValue(0);
  const diagOpacity = diag ?? fallback;
  const scanY = useTransform(scan ?? fallback, (v) => wall.y + v * (GROUND_Y - wall.y));
  const scanOpacity = useTransform(scan ?? fallback, (v) => (v > 0.002 && v < 0.995 ? 1 : 0));

  // ---------- éléments générés (déterministes) ----------
  const dirt = useMemo(() => {
    const r = seeded(variant === "pavillon" ? 17 : variant === "maison" ? 29 : 43);
    const streaks: { x: number; y: number; w: number; h: number; o: number }[] = [];
    const add = (w: Win | { x: number; y: number; w: number; h: number }) => {
      const n = 3 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const y = w.y + w.h + 7;
        streaks.push({
          x: w.x + 4 + r() * (w.w - 8),
          y,
          w: 2 + r() * 5,
          h: Math.min(GROUND_Y - y - 4, 30 + r() * 95),
          o: 0.35 + r() * 0.4,
        });
      }
    };
    s.windows.forEach(add);
    // coulures sous la toiture
    for (let i = 0; i < 22; i++) {
      streaks.push({ x: wall.x + r() * wall.w, y: wall.y, w: 2 + r() * 6, h: 25 + r() * 90, o: 0.25 + r() * 0.35 });
    }
    const moss: { cx: number; cy: number; rx: number; ry: number; o: number }[] = [];
    for (let i = 0; i < 16; i++) {
      moss.push({
        cx: wall.x + r() * wall.w,
        cy: GROUND_Y - 6 - r() * (s.base + 26),
        rx: 18 + r() * 48,
        ry: 9 + r() * 22,
        o: 0.55 + r() * 0.4,
      });
    }
    for (const side of [0, 1]) {
      for (let i = 0; i < 3; i++) {
        moss.push({
          cx: wall.x + (side ? wall.w - 10 - r() * 50 : 10 + r() * 50),
          cy: wall.y + 10 + r() * 40,
          rx: 14 + r() * 30,
          ry: 8 + r() * 16,
          o: 0.35 + r() * 0.3,
        });
      }
    }
    const drops: { cx: number; cy: number; r: number }[] = [];
    for (let i = 0; i < 46; i++) {
      drops.push({ cx: wall.x + 12 + r() * (wall.w - 24), cy: wall.y + 14 + r() * (wall.h - 40), r: 1.6 + r() * 3.2 });
    }
    const spray: { cx: number; cy: number; r: number }[] = [];
    for (let i = 0; i < 26; i++) spray.push({ cx: 6 + r() * 34, cy: wall.y + r() * wall.h, r: 0.8 + r() * 2.2 });
    return { streaks, moss, drops, spray };
  }, [variant, s, wall]);

  const roofFill = s.roof.kind === "tiles" ? url("tiles") : s.roof.kind === "slate" ? url("slate") : url("zinc");

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={title ?? `Illustration d'une façade de ${s.label.toLowerCase()}`}
    >
      <defs>
        <clipPath id={id("wall")}>
          <rect x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} />
        </clipPath>
        <clipPath id={id("dirt")}>
          <motion.rect x={dirtX} y={wall.y - 4} width={dirtW} height={GROUND_Y - wall.y + 8} />
        </clipPath>
        <clipPath id={id("paint")}>
          <motion.rect x={wall.x - 2} y={wall.y - 1} width={wall.w + 4} height={paintH} />
        </clipPath>

        <pattern id={id("crepi")} width="160" height="160" patternUnits="userSpaceOnUse">
          <image href="/textures/crepi.png" width="160" height="160" />
        </pattern>

        <pattern id={id("tiles")} width="26" height="15" patternUnits="userSpaceOnUse">
          <rect width="26" height="15" fill="#B1613F" />
          <path d="M0 15 Q6.5 7 13 15 Q19.5 7 26 15" fill="none" stroke="#7E4029" strokeOpacity=".55" strokeWidth="1.4" />
          <path d="M0 8 L26 8" stroke="#C97B57" strokeOpacity=".35" strokeWidth="1" />
        </pattern>
        <pattern id={id("slate")} width="20" height="11" patternUnits="userSpaceOnUse">
          <rect width="20" height="11" fill="#57616B" />
          <path d="M0 10.5 H20 M10 0 V10.5" stroke="#3F474F" strokeWidth="1" />
          <path d="M1 2 H9" stroke="#6E7882" strokeWidth="1" />
        </pattern>
        <pattern id={id("zinc")} width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="#8D979E" />
          <path d="M0.5 0 V18" stroke="#B4BCC2" strokeWidth="1.2" />
          <path d="M2 0 V18" stroke="#74808A" strokeWidth="1" />
        </pattern>

        <linearGradient id={id("roofShade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".28" />
          <stop offset=".7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7F93A6" />
          <stop offset=".55" stopColor="#3E4D5C" />
          <stop offset="1" stopColor="#25303B" />
        </linearGradient>
        <linearGradient id={id("streak")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E2C24" stopOpacity=".9" />
          <stop offset="1" stopColor="#2E2C24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("topRun")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A382E" stopOpacity=".55" />
          <stop offset="1" stopColor="#3A382E" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("moss")}>
          <stop offset="0" stopColor="#5F6B3A" stopOpacity=".95" />
          <stop offset=".55" stopColor="#6F7A45" stopOpacity=".6" />
          <stop offset="1" stopColor="#6F7A45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("spray")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9F4FF" stopOpacity="0" />
          <stop offset=".55" stopColor="#F4FAFF" stopOpacity=".95" />
          <stop offset=".75" stopColor="#CFE6FF" stopOpacity=".7" />
          <stop offset="1" stopColor="#CFE6FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("roller")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id={id("shadow")}>
          <stop offset="0" stopColor="#1A1E24" stopOpacity=".22" />
          <stop offset="1" stopColor="#1A1E24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("wallLight")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".10" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".07" />
        </linearGradient>
      </defs>

      {/* sol */}
      <ellipse cx="400" cy={GROUND_Y + 6} rx="380" ry="26" fill={url("shadow")} />
      <rect x="30" y={GROUND_Y} width="740" height="2" fill={INK} opacity=".12" />

      {/* cheminées (derrière le toit) */}
      {s.roof.chimneys.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="#B9AE9C" />
          <rect x={c.x - 3} y={c.y - 6} width={c.w + 6} height="8" fill="#9C9180" />
          <rect x={c.x + c.w * 0.62} y={c.y} width={c.w * 0.38} height={c.h} fill="#000" opacity=".08" />
        </g>
      ))}

      {/* mur : teinte d'origine, peinture, grain */}
      <rect x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} fill={s.originalWall} />
      <g clipPath={url("paint")}>
        <motion.rect
          x={wall.x}
          y={wall.y}
          width={wall.w}
          height={GROUND_Y - wall.y}
          style={{ fill: wallColor as never, transition: typeof wallColor === "string" ? "fill .7s ease" : undefined }}
        />
      </g>
      <rect x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} fill={url("crepi")} opacity=".7" />
      <rect x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} fill={url("wallLight")} />

      {/* soubassement + bandeaux */}
      <rect x={wall.x} y={GROUND_Y - s.base} width={wall.w} height={s.base} fill="#3F3A30" opacity=".16" />
      <rect x={wall.x} y={GROUND_Y - s.base} width={wall.w} height="2" fill="#fff" opacity=".35" />
      {s.bands.map((y) => (
        <g key={y}>
          <rect x={wall.x} y={y - 4} width={wall.w} height="7" fill="#fff" opacity=".32" />
          <rect x={wall.x} y={y + 3} width={wall.w} height="2" fill="#000" opacity=".07" />
        </g>
      ))}
      {variant === "immeuble" && (
        <g>
          <rect x={wall.x - 6} y={wall.y} width={wall.w + 12} height="10" fill="#E6DECF" />
          <rect x={wall.x - 6} y={wall.y + 10} width={wall.w + 12} height="3" fill="#000" opacity=".1" />
        </g>
      )}

      {/* fissures */}
      <motion.g style={{ opacity: crackOpacity }} clipPath={url("wall")}>
        {s.cracks.map((c, i) => (
          <path key={i} d={c.d} fill="none" stroke="#2B2822" strokeWidth="1.6" strokeLinejoin="round" opacity=".8" />
        ))}
      </motion.g>

      {/* crasse (balayée par le nettoyage) */}
      <g clipPath={url("wall")}>
        <g clipPath={url("dirt")}>
          <image href="/textures/grime.png" x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} preserveAspectRatio="none" opacity=".9" />
          <rect x={wall.x} y={wall.y} width={wall.w} height="70" fill={url("topRun")} />
          {dirt.streaks.map((st, i) => (
            <rect key={i} x={st.x} y={st.y} width={st.w} height={st.h} rx={st.w / 2} fill={url("streak")} opacity={st.o} />
          ))}
          {dirt.moss.map((m, i) => (
            <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} fill={url("moss")} opacity={m.o} />
          ))}
          <rect x={wall.x} y={wall.y} width={wall.w} height={GROUND_Y - wall.y} fill="#6B6553" opacity=".16" />
        </g>
      </g>

      {/* balcons filants (immeuble) */}
      {s.balconies.map((b, i) => (
        <g key={i}>
          <rect x={wall.x + 8} y={b.y} width={wall.w - 16} height="6" fill="#E9E2D4" />
          <rect x={wall.x + 8} y={b.y + 6} width={wall.w - 16} height="3" fill="#000" opacity=".12" />
          <Railing x={wall.x + 12} y={b.y - 22} w={wall.w - 24} h={22} color={accentColor} />
        </g>
      ))}

      {/* fenêtres */}
      {s.windows.map((w, i) => (
        <Window key={i} w={w} glass={url("glass")} accent={accentColor} />
      ))}

      {/* porte */}
      <DoorShape door={s.door} accent={accentColor} glass={url("glass")} />

      {/* toiture */}
      <polygon points={s.roof.points} fill={roofFill} />
      <polygon points={s.roof.points} fill={url("roofShade")} />
      {s.roof.dormers.map((d, i) => (
        <g key={i}>
          <rect x={d.x - 4} y={d.y} width={d.w + 8} height={d.h + 4} fill="#E3DBCC" />
          <rect x={d.x + 4} y={d.y + 10} width={d.w - 8} height={d.h - 12} fill={url("glass")} />
          <path d={`M${d.x - 8} ${d.y + 2} L${d.x + d.w / 2} ${d.y - 16} L${d.x + d.w + 8} ${d.y + 2} Z`} fill={variant === "immeuble" ? "#7D878E" : "#4B545D"} />
          <rect x={d.x - 4} y={d.y + d.h + 2} width={d.w + 8} height="3" fill="#000" opacity=".15" />
        </g>
      ))}
      {(() => {
        const pts = s.roof.points.split(" ").map((p) => p.split(",").map(Number));
        return <rect x={pts[0][0]} y={pts[0][1] - 3} width={pts[1][0] - pts[0][0]} height="6" rx="2" fill="#6E747A" />;
      })()}

      {/* végétation */}
      {s.plants && (
        <g>
          <path d="M60 560 C58 520 92 500 118 512 C132 486 172 494 176 524 C196 520 206 544 200 560 Z" fill="#6A8757" />
          <path d="M84 560 C84 534 108 524 124 534 C140 520 160 532 160 560 Z" fill="#587449" />
          <path d="M610 560 C606 526 640 508 664 520 C682 498 724 508 726 536 C742 538 748 552 744 560 Z" fill="#6A8757" />
          <path d="M640 560 C640 538 662 530 676 540 C690 530 706 542 706 560 Z" fill="#587449" />
        </g>
      )}

      {showTools && (
        <>
          {/* hydrofuge : perles d'eau + reflet */}
          <motion.g style={{ opacity: dropsOpacity }} clipPath={url("wall")}>
            {dirt.drops.map((d, i) => (
              <g key={i}>
                <circle cx={d.cx} cy={d.cy} r={d.r} fill="#DDEBFA" opacity=".85" />
                <circle cx={d.cx - d.r * 0.35} cy={d.cy - d.r * 0.35} r={d.r * 0.35} fill="#fff" />
                <circle cx={d.cx} cy={d.cy + d.r * 0.6} r={d.r * 0.9} fill="#000" opacity=".06" />
              </g>
            ))}
          </motion.g>
          <g clipPath={url("wall")}>
            <motion.rect x={sheenX} y={wall.y} width="220" height={GROUND_Y - wall.y} fill={url("sheen")} style={{ opacity: sheenOpacity }} transform="skewX(-12)" />
          </g>

          {/* jet de nettoyage */}
          <motion.g style={{ opacity: sprayOpacity }}>
            <motion.g style={{ x: sprayX }}>
              <rect x="0" y={wall.y - 10} width="44" height={GROUND_Y - wall.y + 10} fill={url("spray")} />
              {dirt.spray.map((d, i) => (
                <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#fff" opacity=".9" />
              ))}
              <rect x="32" y={wall.y - 6} width="3" height={GROUND_Y - wall.y + 6} fill="#fff" opacity=".9" />
            </motion.g>
          </motion.g>

          {/* rouleau de peinture */}
          <motion.g style={{ opacity: rollerOpacity }}>
            <motion.rect x={wall.x - 4} y={rollerY} width={wall.w + 8} height="16" fill={url("roller")} />
          </motion.g>

          {/* diagnostic */}
          <motion.rect x={wall.x - 12} y={scanY} width={wall.w + 24} height="2" fill={BLUE} style={{ opacity: scanOpacity }} />
          <motion.g style={{ opacity: diagOpacity }}>
            <Dimension x1={wall.x} x2={wall.x + wall.w} y={GROUND_Y + 30} label={s.dims.width} />
            <DimensionV x={wall.x + wall.w + 32} y1={wall.y} y2={GROUND_Y} label={s.dims.height} />
            {s.cracks.slice(0, 1).map((c, i) => (
              <Callout key={i} cx={c.cx} cy={c.cy} label={c.label} side={c.cx > 400 ? "left" : "right"} />
            ))}
            <Callout cx={s.moisture.x} cy={s.moisture.y} label="Humidité 18 %" side="right" small />
          </motion.g>
        </>
      )}
    </svg>
  );
}

function Window({ w, glass, accent }: { w: Win; glass: string; accent: Color }) {
  const frame = "#F3F2EE";
  const sw = w.w / 2 + 1;
  return (
    <g>
      {w.shutters && (
        <g>
          <Shutter x={w.x - sw - 2} y={w.y - 2} w={sw} h={w.h + 4} color={accent} />
          <Shutter x={w.x + w.w + 2} y={w.y - 2} w={sw} h={w.h + 4} color={accent} />
        </g>
      )}
      <rect x={w.x - 3} y={w.y - 6} width={w.w + 6} height="6" fill="#000" opacity=".06" />
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={frame} />
      <rect x={w.x + 5} y={w.y + 5} width={w.w - 10} height={w.h - 10} fill={glass} />
      <path d={`M${w.x + 8} ${w.y + w.h * 0.55} L${w.x + w.w * 0.45} ${w.y + 8} L${w.x + w.w * 0.62} ${w.y + 8} L${w.x + 8} ${w.y + w.h * 0.8} Z`} fill="#fff" opacity=".16" />
      <rect x={w.x + w.w / 2 - 1.5} y={w.y + 5} width="3" height={w.h - 10} fill={frame} />
      <rect x={w.x + 5} y={w.y + w.h * 0.36} width={w.w - 10} height="2.5" fill={frame} />
      {w.railing && <Railing x={w.x + 2} y={w.y + w.h - 30} w={w.w - 4} h={26} color={accent} />}
      <rect x={w.x - 7} y={w.y + w.h} width={w.w + 14} height="7" fill="#ECE7DD" />
      <rect x={w.x - 7} y={w.y + w.h + 7} width={w.w + 14} height="2" fill="#000" opacity=".14" />
    </g>
  );
}

function Shutter({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: Color }) {
  const slats = [];
  for (let yy = y + 6; yy < y + h - 4; yy += 6) slats.push(yy);
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        style={{ fill: color as never, transition: typeof color === "string" ? "fill .7s ease" : undefined }}
      />
      {slats.map((yy) => (
        <rect key={yy} x={x + 3} y={yy} width={w - 6} height="1.4" fill="#000" opacity=".2" />
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#000" strokeOpacity=".18" />
    </g>
  );
}

function Railing({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: Color }) {
  const bars = [];
  for (let xx = x + 5; xx < x + w - 2; xx += 5) bars.push(xx);
  const style = { fill: color as never, transition: typeof color === "string" ? "fill .7s ease" : undefined };
  return (
    <g>
      <motion.rect x={x} y={y} width={w} height="2.5" style={style} />
      <motion.rect x={x} y={y + h - 2} width={w} height="2" style={style} />
      {bars.map((xx) => (
        <motion.rect key={xx} x={xx} y={y} width="1.4" height={h} style={style} />
      ))}
    </g>
  );
}

function DoorShape({ door, accent, glass }: { door: { x: number; y: number; w: number; h: number; arched?: boolean; transom?: boolean }; accent: Color; glass: string }) {
  const { x, y, w, h } = door;
  const style = { fill: accent as never, transition: typeof accent === "string" ? "fill .7s ease" : undefined };
  if (door.arched) {
    const r = w / 2;
    const d = `M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z`;
    return (
      <g>
        <path d={`M${x - 8} ${y + h} V${y + r} A${r + 8} ${r + 8} 0 0 1 ${x + w + 8} ${y + r} V${y + h} Z`} fill="#E8E0D0" />
        <motion.path d={d} style={style} />
        <path d={`M${x + 6} ${y + r} A${r - 6} ${r - 6} 0 0 1 ${x + w - 6} ${y + r} Z`} fill={glass} />
        <rect x={x + w / 2 - 1} y={y + r} width="2" height={h - r} fill="#000" opacity=".25" />
        <circle cx={x + w / 2 - 6} cy={y + h * 0.62} r="2.2" fill="#C9B38A" />
        <circle cx={x + w / 2 + 6} cy={y + h * 0.62} r="2.2" fill="#C9B38A" />
      </g>
    );
  }
  return (
    <g>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 5} fill="#ECE6DB" />
      <motion.rect x={x} y={y} width={w} height={h} style={style} />
      {door.transom && <rect x={x + 6} y={y + 6} width={w - 12} height={h * 0.18} fill={glass} />}
      <rect x={x + 8} y={y + h * 0.28} width={w - 16} height={h * 0.3} fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="1.5" />
      <rect x={x + 8} y={y + h * 0.63} width={w - 16} height={h * 0.3} fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="1.5" />
      <circle cx={x + w - 11} cy={y + h * 0.58} r="2.6" fill="#C9B38A" />
      <rect x={x - 10} y={y + h - 4} width={w + 20} height="4" fill="#BDB6AA" />
    </g>
  );
}

function Dimension({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mid = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={BLUE} strokeWidth="1.5" />
      <line x1={x1} y1={y - 8} x2={x1} y2={y + 8} stroke={BLUE} strokeWidth="1.5" />
      <line x1={x2} y1={y - 8} x2={x2} y2={y + 8} stroke={BLUE} strokeWidth="1.5" />
      <rect x={mid - 40} y={y - 13} width="80" height="26" rx="13" fill={BLUE} />
      <text x={mid} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">
        {label}
      </text>
    </g>
  );
}

function DimensionV({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={BLUE} strokeWidth="1.5" />
      <line x1={x - 8} y1={y1} x2={x + 8} y2={y1} stroke={BLUE} strokeWidth="1.5" />
      <line x1={x - 8} y1={y2} x2={x + 8} y2={y2} stroke={BLUE} strokeWidth="1.5" />
      <rect x={x - 13} y={mid - 38} width="26" height="76" rx="13" fill={BLUE} />
      <text x={x} y={mid} textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff" transform={`rotate(-90 ${x} ${mid})`} dy="5">
        {label}
      </text>
    </g>
  );
}

function Callout({ cx, cy, label, side, small }: { cx: number; cy: number; label: string; side: "left" | "right"; small?: boolean }) {
  const r = small ? 14 : 22;
  const len = 46;
  const lx = side === "right" ? cx + r + len : cx - r - len;
  const tw = label.length * 7.6 + 24;
  const bx = side === "right" ? lx : lx - tw;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={BLUE} fillOpacity=".1" stroke={BLUE} strokeWidth="1.8" />
      <line x1={side === "right" ? cx + r : cx - r} y1={cy} x2={lx} y2={cy} stroke={BLUE} strokeWidth="1.5" />
      <rect x={bx} y={cy - 14} width={tw} height="28" rx="14" fill="#fff" stroke={BLUE} strokeWidth="1.5" />
      <text x={bx + tw / 2} y={cy + 5} textAnchor="middle" fontSize="13.5" fontWeight="600" fill={BLUE}>
        {label}
      </text>
    </g>
  );
}

/** Façade fixe (avant / après), avec couleurs pilotables. */
export function StaticFacade({
  variant,
  state,
  wallColor,
  accentColor,
  className,
  title,
  framed = true,
}: {
  variant: Variant;
  state: "before" | "after";
  wallColor: string;
  accentColor: string;
  className?: string;
  title?: string;
  framed?: boolean;
}) {
  const v = state === "after" ? 1 : 0;
  const clean = useMotionValue(v);
  const protect = useMotionValue(v);
  const paint = useMotionValue(v);
  useEffect(() => {
    clean.set(v);
    protect.set(v);
    paint.set(v);
  }, [v, clean, protect, paint]);
  const s = specs[variant];
  return (
    <Facade
      variant={variant}
      clean={clean}
      protect={protect}
      paint={paint}
      wallColor={state === "after" ? wallColor : s.originalWall}
      accentColor={state === "after" ? accentColor : "#8C918A"}
      className={className}
      title={title}
      showTools={false}
      viewBox={framed ? s.frame : undefined}
    />
  );
}
