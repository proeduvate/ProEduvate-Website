"use client";

/*
 * Browser-side client for the content API's write endpoints.
 *
 * Separate from lib/api.ts on purpose. That one runs on the server, reads
 * only, and is fail-soft -- a dead API means the site quietly uses static
 * data. This one runs in the browser, writes, and must be fail-loud: an
 * editor pressing Save has to be told plainly if it did not save.
 *
 * The token lives in sessionStorage, so it dies with the tab rather than
 * persisting on a shared machine. That is a deliberate trade against
 * convenience, and it is still a bearer token in browser-reachable storage --
 * any XSS on this route can read it. Acceptable for an internal editor on a
 * route nobody links to; not something to reuse for anything sensitive.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const TOKEN_KEY = "proeduvate.admin.token";

export const apiBase = BASE;
export const apiConfigured = BASE.length > 0;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

/*
 * The token is an external store rather than component state, so the shell
 * can subscribe to it. That is what makes the 401 handler below sufficient on
 * its own: an expired token clears itself, the subscription fires, and the
 * login form comes back without anyone having to thread a callback through.
 */
const tokenListeners = new Set<() => void>();

function announce() {
  for (const listener of tokenListeners) listener();
}

export function setToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  announce();
}

export function clearToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
  announce();
}

export function subscribeToken(onChange: () => void) {
  tokenListeners.add(onChange);
  return () => {
    tokenListeners.delete(onChange);
  };
}

// sessionStorage does not exist while rendering on the server, so the server
// snapshot is always "signed out" and the real value arrives on hydration.
export const getTokenServerSnapshot = () => null;

/**
 * The email inside the token, for display only — this is the caller's own
 * token and the signature is never checked here. The API re-verifies it on
 * every request, which is where that decision actually matters.
 */
export function tokenSubject(token: string | null): string | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as { sub?: unknown };
    return typeof claims.sub === "string" ? claims.sub : null;
  } catch {
    return null;
  }
}

/** Thrown for any non-2xx so callers can show the real reason. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiConfigured) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not set", 0);
  }

  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(`Cannot reach the API at ${BASE}`, 0);
  }

  if (res.status === 401) {
    // Expired or revoked: drop it so the shell shows the login form again
    // rather than looping on failed writes.
    clearToken();
    throw new ApiError("Session expired — sign in again", 401);
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail)) {
        // FastAPI validation errors: surface the field, not just "422".
        detail = body.detail
          .map((d: { loc?: string[]; msg?: string }) =>
            `${d.loc?.slice(1).join(".") ?? "body"}: ${d.msg ?? "invalid"}`
          )
          .join("; ");
      }
    } catch {
      /* keep the status line */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function login(email: string, password: string): Promise<void> {
  // The token endpoint takes form encoding, not JSON -- it is OAuth2's
  // password flow, so this one call cannot go through `request`.
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE}/api/v1/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {
    throw new ApiError(`Cannot reach the API at ${BASE}`, 0);
  });

  if (!res.ok) {
    throw new ApiError(
      res.status === 401 ? "Incorrect email or password" : `Sign-in failed (${res.status})`,
      res.status
    );
  }
  const data = (await res.json()) as { access_token: string };
  setToken(data.access_token);
}

export type Row = Record<string, unknown> & { id: number };

export const api = {
  /** Drafts included: the admin is exactly where unpublished rows matter. */
  list: (collection: string) =>
    request<Row[]>(`/api/v1/${collection}?include_unpublished=true&limit=500`),
  create: (collection: string, body: unknown) =>
    request<Row>(`/api/v1/${collection}`, { method: "POST", body: JSON.stringify(body) }),
  update: (collection: string, id: number, body: unknown) =>
    request<Row>(`/api/v1/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (collection: string, id: number) =>
    request<void>(`/api/v1/${collection}/${id}`, { method: "DELETE" }),
  reorder: (collection: string, ids: number[]) =>
    request<Row[]>(`/api/v1/${collection}/reorder`, {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
  getSingleton: (name: string) => request<Row>(`/api/v1/${name}`),
  updateSingleton: (name: string, body: unknown) =>
    request<Row>(`/api/v1/${name}`, { method: "PATCH", body: JSON.stringify(body) }),
};

/** Everything editable, in the order it appears on the site. */
export const COLLECTIONS = [
  { slug: "products", label: "Products" },
  { slug: "services", label: "Services" },
  { slug: "sectors", label: "Sectors" },
  { slug: "domains", label: "Domains" },
  { slug: "custom-projects", label: "Custom projects" },
  { slug: "milestones", label: "Milestones" },
  { slug: "stats", label: "Stats" },
  { slug: "achievement-highlights", label: "Achievement highlights" },
  { slug: "monthly-stars", label: "Star of the month" },
  { slug: "recognitions", label: "Recognitions" },
  { slug: "values", label: "Values" },
  { slug: "reasons", label: "Why choose us" },
  { slug: "intern-reviews", label: "Intern reviews" },
  { slug: "jobs", label: "Jobs" },
  { slug: "internships", label: "Internships" },
  { slug: "org-seats", label: "Org seats" },
  { slug: "core-team", label: "Core team" },
  { slug: "tech-stack", label: "Tech stack" },
  { slug: "client-logos", label: "Client logos" },
] as const;

export const SINGLETONS = [
  { slug: "ceo", label: "CEO profile" },
  { slug: "contact", label: "Contact details" },
] as const;

/** Server-owned; never sent back on create or update. */
export const READ_ONLY_FIELDS = new Set(["id", "created_at", "updated_at"]);
