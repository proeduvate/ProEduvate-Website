"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * WebGLBoundary only catches synchronous render-time throws (e.g. context
 * creation failing at mount). It can't catch an async `webglcontextlost`
 * event after a successful mount — a GPU driver crash, mobile tab
 * backgrounding, or (confirmed directly in testing) a canvas losing its
 * context during teardown at a section transition. This listens on the
 * canvas's container and flips a flag the parent section reads to fall
 * back to the static layer when that happens.
 */
export function useContextLossFallback(containerRef: RefObject<HTMLElement | null>): boolean {
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleLost = (event: Event) => {
      if ((event.target as HTMLElement)?.tagName !== "CANVAS") return;
      event.preventDefault();
      setLost(true);
    };
    const handleRestored = (event: Event) => {
      if ((event.target as HTMLElement)?.tagName !== "CANVAS") return;
      setLost(false);
    };

    container.addEventListener("webglcontextlost", handleLost, true);
    container.addEventListener("webglcontextrestored", handleRestored, true);
    return () => {
      container.removeEventListener("webglcontextlost", handleLost, true);
      container.removeEventListener("webglcontextrestored", handleRestored, true);
    };
  }, [containerRef]);

  return lost;
}
