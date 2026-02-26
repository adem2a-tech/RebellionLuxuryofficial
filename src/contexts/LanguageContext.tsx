import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type Locale = "fr" | "en";

const STORAGE_KEY = "rebellion-lang";

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    "menu.home": "Accueil",
    "menu.vehicles": "Véhicules",
    "menu.catalogue": "Catalogue",
    "menu.calculatePrice": "Calculez le prix",
    "menu.rentYourCar": "Loue ton propre véhicule",
    "menu.rent": "Louer",
    "menu.viewRequests": "Voir mes demandes",
    "menu.about": "À propos",
    "menu.profitability": "Rentabilité",
    "menu.transport": "Transport",
    "menu.networks": "Réseaux",
    "menu.proSpace": "Espace pro",
    "menu.contact": "Contact",
    "menu.assistant": "Rebellion IA",
    "menu.language": "Langue",
    "cta.viewVehicle": "Voir les détails",
    "price.from": "À partir de",
    "price.perDay": "/24h",
    "forfait.24h": "24h",
    "forfait.we48": "W-E (48h)",
    "forfait.we72": "W-E (72h)",
    "forfait.lunVen": "Lun-Ven",
    "forfait.semaine": "Semaine",
    "forfait.mois": "Mois",
    "calculator.title": "Calculez le prix",
    "calculator.desc": "Estimation selon le véhicule, le forfait choisi, les km supplémentaires et le transport (Evionnaz → client → Evionnaz à 2 CHF/km).",
    "calculator.vehicle": "Véhicule",
    "calculator.vehiclePlaceholder": "Choisir un véhicule",
    "calculator.forfait": "Forfait",
    "calculator.forfaitPlaceholder": "Choisir un forfait",
    "calculator.extraKm": "Km supplémentaires",
    "calculator.transportKm": "Transport (km)",
    "calculator.extraKmHelp": "km inclus dans le forfait. Au-delà",
    "calculator.transportHelp": "Evionnaz → client → Evionnaz.",
    "calculator.total": "Total",
    "calculator.totalToPay": "Total à payer",
    "calculator.breakdown": "Détail",
    "calculator.accordingToVehicle": "Tarif selon véhicule",
  },
  en: {
    "menu.home": "Home",
    "menu.vehicles": "Vehicles",
    "menu.catalogue": "Catalogue",
    "menu.calculatePrice": "Calculate price",
    "menu.rentYourCar": "Rent your own car",
    "menu.rent": "Rent",
    "menu.viewRequests": "View my requests",
    "menu.about": "About",
    "menu.profitability": "Profitability",
    "menu.transport": "Transport",
    "menu.networks": "Networks",
    "menu.proSpace": "Pro space",
    "menu.contact": "Contact",
    "menu.assistant": "Rebellion IA",
    "menu.language": "Language",
    "cta.viewVehicle": "View details",
    "price.from": "From",
    "price.perDay": "/24h",
    "forfait.24h": "24h",
    "forfait.we48": "W-E (48h)",
    "forfait.we72": "W-E (72h)",
    "forfait.lunVen": "Mon-Fri",
    "forfait.semaine": "Week",
    "forfait.mois": "Month",
    "calculator.title": "Calculate price",
    "calculator.desc": "Estimate based on vehicle, package, extra km and transport (Evionnaz → client → Evionnaz at 2 CHF/km).",
    "calculator.vehicle": "Vehicle",
    "calculator.vehiclePlaceholder": "Choose a vehicle",
    "calculator.forfait": "Package",
    "calculator.forfaitPlaceholder": "Choose a package",
    "calculator.extraKm": "Extra km",
    "calculator.transportKm": "Transport (km)",
    "calculator.extraKmHelp": "km included in package. Beyond",
    "calculator.transportHelp": "Evionnaz → client → Evionnaz.",
    "calculator.total": "Total",
    "calculator.totalToPay": "Total to pay",
    "calculator.breakdown": "Breakdown",
    "calculator.accordingToVehicle": "Rate according to vehicle",
  },
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const defaultLocale: Locale = "fr";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return stored === "en" || stored === "fr" ? stored : defaultLocale;
  });

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string) => {
      const map = translations[locale];
      return map?.[key] ?? translations[defaultLocale][key] ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
