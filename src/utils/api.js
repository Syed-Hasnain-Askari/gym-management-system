// ─── CONFIG ──────────────────────────────────────────────────────────────────
export const API = "http://localhost:5000/api";

// ─── API HELPERS ─────────────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
  try {
    const r = await fetch(API + path, { headers: { "Content-Type": "application/json" }, ...options });
    return await r.json();
  } catch {
    return null; // backend offline → use mock
  }
}