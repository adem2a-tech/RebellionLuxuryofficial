import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { addVisitor } from "@/data/visitors";
import SplashScreen from "@/components/SplashScreen";
import { COOKIE_BANNER_OPEN_EVENT } from "@/components/CookieConsent";

const STORAGE_KEY = "rebellion_user";
const POPUP_SEEN_KEY = "rebellion_popup_seen";

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
};

export type AppPhase = "identification" | "transition" | "app";

type UserContextValue = {
  user: UserData | null;
  isIdentified: boolean;
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  identify: (data: UserData) => void;
  resetIdentification: () => void;
  /** true si l'utilisateur a été rechargé depuis le stockage (retour sur le site) */
  loadedFromStorage: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

function loadUserFromStorage(): UserData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserData;
    if (
      typeof parsed.firstName === "string" &&
      typeof parsed.lastName === "string" &&
      typeof parsed.email === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [phase, setPhase] = useState<AppPhase>("identification");
  const [hydrated, setHydrated] = useState(false);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    // Cookie de visite (pro) — posé dès l'arrivée sur le site
    try {
      const existing = document.cookie.includes("rebellion_visit=");
      if (!existing) {
        document.cookie = `rebellion_visit=${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
    const stored = loadUserFromStorage();
    if (stored) {
      setUser(stored);
      setPhase("transition");
      setLoadedFromStorage(true);
    }
    setHydrated(true);
  }, []);

  const identify = useCallback((data: UserData) => {
    addVisitor(data);
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPhase("transition");
  }, []);

  const resetIdentification = useCallback(() => {
    setUser(null);
    setPhase("identification");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(POPUP_SEEN_KEY);
      // Rouvrir le bandeau cookies à la réidentification
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(COOKIE_BANNER_OPEN_EVENT));
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isIdentified: !!user,
      phase,
      setPhase,
      identify,
      resetIdentification,
      loadedFromStorage,
    }),
    [user, phase, identify, resetIdentification, loadedFromStorage],
  );

  const [splashDone, setSplashDone] = useState(false);

  if (!hydrated || !splashDone) {
    return (
      <SplashScreen
        onComplete={() => {
          setSplashDone(true);
        }}
      />
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
