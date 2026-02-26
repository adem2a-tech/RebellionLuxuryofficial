import React, { createContext, useContext, useCallback, useMemo } from "react";

/** Site en Francs suisses uniquement. */
type CurrencyContextValue = {
  formatPrice: (chfAmount: number) => string;
  formatPriceBoth: (chfAmount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const formatPrice = useCallback((chfAmount: number) => {
    return `${chfAmount.toLocaleString("fr-CH")} CHF`;
  }, []);

  const formatPriceBoth = useCallback((chfAmount: number) => {
    return `${chfAmount.toLocaleString("fr-CH")} CHF`;
  }, []);

  const value = useMemo(() => ({ formatPrice, formatPriceBoth }), [formatPrice, formatPriceBoth]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

/** Parse un prix stocké en "XXX CHF" ou "X'XXX CHF" → number ou null si "Sur demande" */
export function parseChfPrice(priceStr: string): number | null {
  if (!priceStr || !priceStr.includes("CHF")) return null;
  const cleaned = priceStr.replace(/'/g, "").replace(/\s*CHF\s*/i, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}
