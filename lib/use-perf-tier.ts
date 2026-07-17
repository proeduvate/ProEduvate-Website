"use client";

import { useSyncExternalStore } from "react";

// Mobile and coarse-pointer devices get the cheap glass material and skip
// post-processing — MeshTransmissionMaterial's per-instance offscreen
// render-to-texture pass is expensive enough to jank low-end GPUs.
const QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export type PerfTier = "high" | "low";

export function usePerfTier(): PerfTier {
  const isLow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isLow ? "low" : "high";
}
