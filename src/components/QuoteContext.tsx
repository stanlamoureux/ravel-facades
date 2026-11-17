"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { WorkId } from "@/config/offer";

/** Infos glanées sur la page (nuancier, prestations) et reprises dans le formulaire de devis. */
export type Prefill = {
  works?: string[];
  property?: string;
  surface?: number;
  color?: string;
  accent?: string;
  source?: string;
};

type Ctx = {
  prefill: Prefill;
  goToQuote: (p?: Prefill) => void;
  /** Travaux à présélectionner dans le simulateur (clic sur "Connaître le prix"). */
  simWork: WorkId | null;
  goToEstimate: (work?: WorkId) => void;
};

const QuoteCtx = createContext<Ctx | null>(null);

const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [prefill, setPrefill] = useState<Prefill>({});
  const [simWork, setSimWork] = useState<WorkId | null>(null);

  const goToQuote = useCallback((p?: Prefill) => {
    if (p) setPrefill((prev) => ({ ...prev, ...p }));
    scrollToId("devis");
    window.setTimeout(() => (document.querySelector("#devis [data-autofocus]") as HTMLElement | null)?.focus({ preventScroll: true }), 700);
  }, []);

  const goToEstimate = useCallback((work?: WorkId) => {
    if (work) setSimWork(work);
    scrollToId("simulateur");
  }, []);

  const value = useMemo(() => ({ prefill, goToQuote, simWork, goToEstimate }), [prefill, goToQuote, simWork, goToEstimate]);
  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote doit être utilisé dans QuoteProvider");
  return ctx;
}
