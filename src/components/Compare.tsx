"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Grip } from "./icons";

type Shot = { src: string; alt: string };

/** Comparateur avant / après autonome, pour les fiches prestation. */
export function Compare({ before, after, position = "50% 50%", className = "" }: { before: Shot; after: Shot; position?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const [hint, setHint] = useState(true);
  const sizes = "(min-width: 1024px) 600px, 160vw";

  const fromPointer = useCallback((x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className={`relative touch-pan-y select-none overflow-hidden bg-encre-2 ${className}`}
      style={{ ["--x" as string]: `${pos}%` }}
      onPointerDown={(e) => {
        setHint(false);
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={after.alt} fill quality={85} sizes={sizes} className="pointer-events-none object-cover" style={{ objectPosition: position }} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--x)) 0 0)" }}>
        <Image src={before.src} alt={before.alt} fill quality={85} sizes={sizes} className="pointer-events-none object-cover" style={{ objectPosition: position }} draggable={false} />
      </div>
      <span className="glass pointer-events-none absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[0.8125rem] font-[600] text-white" style={{ opacity: pos < 14 ? 0 : 1 }}>
        Avant
      </span>
      <span className="glass pointer-events-none absolute right-3.5 top-3.5 rounded-full px-3 py-1 text-[0.8125rem] font-[600] text-white" style={{ opacity: pos > 86 ? 0 : 1 }}>
        Après
      </span>
      <span className={`glass pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.8125rem] font-[600] text-white transition-opacity duration-300 ${hint ? "opacity-100" : "opacity-0"}`} aria-hidden>
        Glissez pour comparer
      </span>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white" style={{ left: "var(--x)" }} aria-hidden>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-encre shadow-[0_4px_20px_rgb(0_0_0/0.35)]">
          <Grip className="h-5 w-5" />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          setHint(false);
          setPos(Number(e.target.value));
        }}
        aria-label="Position du comparateur avant / après"
        className="absolute inset-x-0 bottom-0 h-12 w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
      />
    </div>
  );
}
