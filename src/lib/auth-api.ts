/**
 * Client API auth : login, refresh, logout.
 * Access token en mémoire uniquement ; refresh token en cookie HTTP-only.
 */

const API_BASE = "";

type TokenHolder = {
  get: () => string | null;
  set: (token: string | null) => void;
};

let tokenHolder: TokenHolder = {
  get: () => null,
  set: () => {},
};

export function setAuthTokenHolder(holder: TokenHolder) {
  tokenHolder = holder;
}

async function doRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    let data: { accessToken?: string };
    try {
      data = (await res.json()) as { accessToken?: string };
    } catch {
      return null;
    }
    const token = data.accessToken ?? null;
    if (token) tokenHolder.set(token);
    return token;
  } catch {
    return null;
  }
}

export type LoginResult = { ok: true; accessToken: string } | { ok: false; error: string };

export async function login(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    let data: { accessToken?: string; error?: string };
    try {
      data = (await res.json()) as { accessToken?: string; error?: string };
    } catch {
      data = {};
    }
    if (!res.ok) {
      return { ok: false, error: data.error || "Connexion refusée." };
    }
    const token = data.accessToken ?? null;
    if (token) tokenHolder.set(token);
    return { ok: true, accessToken: token };
  } catch {
    return { ok: false, error: "API indisponible." };
  }
}

export async function refreshSession(): Promise<string | null> {
  return doRefresh();
}

export async function logout(): Promise<void> {
  tokenHolder.set(null);
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

export async function logoutAllDevices(): Promise<void> {
  tokenHolder.set(null);
  await fetch(`${API_BASE}/api/auth/logout-all`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Fetch avec Authorization Bearer et reconnexion silencieuse si 401.
 * En cas de 401 : tente refresh puis réessaie la requête une fois.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = tokenHolder.get();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let res = await fetch(input, { ...init, credentials: "include", headers });
  if (res.status === 401) {
    const newToken = await doRefresh();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(input, { ...init, credentials: "include", headers });
    }
  }
  return res;
}
