import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "rebellion_pro_logged_in";
const COOKIE_NAME = "rebellion_pro_logged_in";
const COOKIE_MAX_AGE = 730 * 24 * 60 * 60; // 2 ans — persistance tous navigateurs (Safari compatible)
const PRO_CODES = ["huracandidier", "rebellion"];

function setProCookie(loggedIn: boolean) {
  if (typeof document === "undefined") return;
  try {
    const value = loggedIn ? "true" : "";
    const maxAge = loggedIn ? COOKIE_MAX_AGE : 0;
    const secure = typeof window !== "undefined" && window.location?.protocol === "https:";
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
  } catch {
    // ignore (Safari ITP, etc.)
  }
}

function readProCookie(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return document.cookie.includes(`${COOKIE_NAME}=true`);
  } catch {
    return false;
  }
}

/** Lecture sécurisée pour Safari (localStorage peut être indisponible ou lancer en mode privé). */
function readStoredLogin(): boolean {
  if (typeof window === "undefined") return false;
  const fromCookie = readProCookie();
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY) === "true";
    if (fromCookie && !fromStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // Safari: stockage désactivé, on s'appuie sur le cookie
      }
    }
    return fromStorage || fromCookie;
  } catch {
    return fromCookie;
  }
}

type ProAuthContextValue = {
  isProLoggedIn: boolean;
  login: (code: string) => boolean;
  logout: () => void;
};

const ProAuthContext = createContext<ProAuthContextValue | null>(null);

export function ProAuthProvider({ children }: { children: ReactNode }) {
  const [isProLoggedIn, setIsProLoggedIn] = useState(() => readStoredLogin());

  // Réhydratation Safari / iOS : le stockage peut être retardé ou bloqué au premier rendu
  useEffect(() => {
    const resync = () => {
      const loggedIn = readStoredLogin();
      setIsProLoggedIn(loggedIn);
    };
    const t1 = setTimeout(resync, 100);
    const t2 = setTimeout(resync, 400);
    const onVisibility = () => {
      if (document.visibilityState === "visible") resync();
    };
    const onFocus = () => resync();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const login = useCallback((code: string): boolean => {
    const trimmed = (code || "").trim().toLowerCase();
    if (PRO_CODES.includes(trimmed)) {
      setProCookie(true);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // Safari mode privé : on garde uniquement le cookie
      }
      setIsProLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setProCookie(false);
    setIsProLoggedIn(false);
  }, []);

  const value: ProAuthContextValue = { isProLoggedIn, login, logout };

  return <ProAuthContext.Provider value={value}>{children}</ProAuthContext.Provider>;
}

export function useProAuth(): ProAuthContextValue {
  const ctx = useContext(ProAuthContext);
  if (!ctx) throw new Error("useProAuth must be used within ProAuthProvider");
  return ctx;
}
