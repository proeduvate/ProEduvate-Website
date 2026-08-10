/*
 * Thin client for the content API.
 *
 * Every read goes through `fetchCollection`, which is deliberately
 * fail-soft: if the API is unreachable, slow, or returns anything unexpected,
 * it returns null and the caller falls back to the static data in `data/`.
 *
 * That fallback is the whole design. This is a marketing site -- a backend
 * that is down must not take the homepage down with it, and it must not be
 * possible for a half-finished migration to blank a section. The static files
 * stay in the repo as the floor, and the API is an override on top of them.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

/**
 * How long Next may serve a cached response before revalidating.
 *
 * Content changes are editorial, not per-request, so a minute of staleness
 * costs nothing and keeps the site up if the API is briefly unavailable.
 */
const REVALIDATE_SECONDS = 60;

/** Give up rather than let a hanging API stall the page render. */
const TIMEOUT_MS = 2500;

export const apiConfigured = BASE.length > 0;

async function get<T>(path: string): Promise<T | null> {
  if (!apiConfigured) return null;

  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[content-api] ${path} -> ${res.status}; using static data`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[content-api] ${path} unreachable (${reason}); using static data`);
    return null;
  }
}

/**
 * Fetches a collection and maps it into the shape the components expect.
 *
 * An empty array counts as a failure, not a result. A collection the site
 * renders is never legitimately empty, and an empty seed or a bad filter
 * would otherwise silently blank a whole section -- falling back to the
 * static copy is always the better outcome.
 */
export async function fetchCollection<TApi, TOut>(
  path: string,
  map: (row: TApi) => TOut
): Promise<TOut[] | null> {
  const rows = await get<TApi[]>(path);
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map(map);
}

export async function fetchSingleton<TApi, TOut>(
  path: string,
  map: (row: TApi) => TOut
): Promise<TOut | null> {
  const row = await get<TApi>(path);
  if (!row || typeof row !== "object") return null;
  return map(row);
}
