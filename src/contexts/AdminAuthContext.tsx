import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/lib/auth-api";

type AdminAuthContextValue = {
  isAdmin: boolean;
  /** true tant que la tentative de reconnexion (refresh) n'a pas été faite */
  isCheckingSession: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ADMIN_FALLBACK_EMAIL = "admin@rebellionluxury.ch";
const ADMIN_FALLBACK_PASSWORD = "huracan2025";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const tokenHolderRef = useRef({ get: () => accessToken, set: setAccessToken });

  useEffect(() => {
    tokenHolderRef.current.get = () => accessToken;
    tokenHolderRef.current.set = setAccessToken;
  }, [accessToken]);

  useEffect(() => {
    authApi.setAuthTokenHolder({
      get: () => tokenHolderRef.current.get(),
      set: (t) => tokenHolderRef.current.set(t),
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await authApi.refreshSession();
      if (!cancelled && token) setAccessToken(token);
      if (!cancelled) setIsCheckingSession(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
      const result = await authApi.login(email, password, rememberMe);
      if (result.ok) {
        setAccessToken(result.accessToken);
        return true;
      }
      if (result.error === "API indisponible.") {
        const ok =
          email.trim().toLowerCase() === ADMIN_FALLBACK_EMAIL && password === ADMIN_FALLBACK_PASSWORD;
        if (ok) {
          setAccessToken("local");
          return true;
        }
      }
      return false;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setAccessToken(null);
  }, []);

  const logoutAllDevices = useCallback(async () => {
    try {
      await authApi.logoutAllDevices();
    } catch {
      // ignore
    }
    setAccessToken(null);
  }, []);

  const value: AdminAuthContextValue = {
    isAdmin: !!accessToken,
    isCheckingSession,
    login,
    logout,
    logoutAllDevices,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
