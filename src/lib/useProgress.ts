import { useEffect, useState } from "react";
import { readingProgress } from "@/config/chapters";

/** Avancement de la lecture dans les chapitres, recalculé au défilement (une fois par image). */
export function useReadingProgress() {
  const [progress, setProgress] = useState(-1);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setProgress(readingProgress());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}
