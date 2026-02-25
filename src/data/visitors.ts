/**
 * Historique des visiteurs identifiés sur le site.
 * Stocké en localStorage pour l'Espace pro.
 */

const STORAGE_KEY = "rebellion_visitors";

export interface VisitorEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string; // ISO
}

function loadVisitors(): VisitorEntry[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVisitors(visitors: VisitorEntry[]) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch {
    // Safari mode privé / stockage désactivé
  }
}

export function addVisitor(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}): VisitorEntry {
  const list = loadVisitors();
  const entry: VisitorEntry = {
    id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  list.push(entry);
  saveVisitors(list);
  try {
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: entry.firstName,
        lastName: entry.lastName,
        email: entry.email,
        phone: entry.phone,
      }),
    }).catch(() => {});
  } catch {
    // ignore
  }
  return entry;
}

export function getAllVisitors(): VisitorEntry[] {
  return loadVisitors();
}

/** Récupère les visiteurs depuis le serveur (Espace pro). En cas d'échec, retourne la liste locale. */
export async function getVisitorsFromServer(): Promise<VisitorEntry[]> {
  try {
    const res = await fetch("/api/visitors");
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {
    // ignore
  }
  return getAllVisitors();
}

/** Réinitialise la liste des visiteurs (remet à 0). */
export function clearVisitors(): void {
  saveVisitors([]);
}
