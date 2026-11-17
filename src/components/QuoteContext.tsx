"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/** Infos glanées sur la page (simulateur, nuancier) et reprises dans le formulaire. */
export type Prefill = {
  works?: string[];
  property?: string;
  surface?: number;
  color?: string;
  accent?: string;
  estimate?: { low: number; high: number };
  source?: string;
};

type Ctx = {
  prefill: Prefill;
  setPrefill: (p: Prefill) => void;
  goToQuote: (p?: Prefill) => void;
};

const QuoteCtx = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [prefill, setPrefillState] = useState<Prefill>({});
  const setPrefill = useCallback((p: Prefill) => setPrefillState((prev) => ({ ...prev, ...p })), []);
  const goToQuote = useCallback(
    (p?: Prefill) => {
      if (p) setPrefill(p);
      const el = document.getElementById("devis");
      el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      window.setTimeout(() => {
        (document.querySelector("#devis [data-autofocus]") as HTMLElement | null)?.focus({ preventScroll: true });
      }, 700);
    },
    [setPrefill],
  );
  const value = useMemo(() => ({ prefill, setPrefill, goToQuote }), [prefill, setPrefill, goToQuote]);
  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote doit être utilisé dans QuoteProvider");
  return ctx;
}
