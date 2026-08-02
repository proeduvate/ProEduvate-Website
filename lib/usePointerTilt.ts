"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * Springy pointer-follow tilt for a 3D stage.
 *
 * Returns a ref to attach to the element that captures the pointer, plus
 * `rotateX`/`rotateY` motion values for the element that should actually
 * rotate (usually a child, so the stage can own the `perspective`).
 *
 * `style` is null under reduced motion, which is the signal to render the
 * content flat rather than tilted.
 */
export function usePointerTilt({ max = 7, maxX = 5 }: { max?: number; maxX?: number } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useSpring(0, { stiffness: 120, damping: 22 });
  const py = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useTransform(px, [-1, 1], [-max, max]);
  const rotateX = useTransform(py, [-1, 1], [maxX, -maxX]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
    function onLeave() {
      px.set(0);
      py.set(0);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [shouldReduceMotion, px, py]);

  return {
    ref,
    shouldReduceMotion,
    style: shouldReduceMotion
      ? null
      : ({ rotateX, rotateY, transformStyle: "preserve-3d" } as const),
  };
}
