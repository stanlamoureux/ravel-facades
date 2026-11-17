"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "motion/react";
import { useEffect, useRef } from "react";

const fmt = new Intl.NumberFormat("fr-FR");

/** Nombre qui glisse vers sa nouvelle valeur (simulateur, chiffres clés). */
export function AnimatedNumber({ value, className, startOnView = false, duration = 0.6 }: { value: number; className?: string; startOnView?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const mv = useMotionValue(startOnView ? 0 : value);
  const text = useTransform(mv, (v) => fmt.format(Math.round(v)));

  useEffect(() => {
    if (startOnView && !inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, inView, startOnView, mv, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
