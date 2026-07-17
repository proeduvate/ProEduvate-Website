"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Scene canvases render `pointer-events-none` so clicks pass through to the
 * real DOM UI on top — which also means R3F's built-in `state.pointer`
 * never updates. Track the cursor on `window` instead and feed it in via a
 * ref that `useFrame` reads every tick.
 */
export function usePointerRef(): RefObject<{ x: number; y: number }> {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);
  return pointer;
}

/** Mirrors a Framer Motion value into a ref so useFrame can read it every tick without triggering React re-renders. */
export function useMotionValueRef(value: MotionValue<number>): RefObject<number> {
  const ref = useRef(value.get());
  useEffect(() => {
    ref.current = value.get();
    return value.on("change", (v) => {
      ref.current = v;
    });
  }, [value]);
  return ref;
}
