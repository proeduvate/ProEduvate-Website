"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// SSR has no `window`, so the server (and the client's first hydration
// pass, per useSyncExternalStore's contract) always assumes motion is not
// reduced. React reconciles to the real client value in a scheduled update
// right after hydration commits — imperceptible, and avoids the mismatch
// that framer-motion's own `useReducedMotion` can trigger by reading
// `matchMedia` synchronously during render.
function getServerSnapshot() {
  return false;
}

export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
