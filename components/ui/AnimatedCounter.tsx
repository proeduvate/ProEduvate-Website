"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "framer-motion";

/*
 * Force the true figure on screen even if the count-up never runs.
 *
 * The rendered text starts at "0" and is only replaced by the animation
 * callback, so an observer that never fires or a frozen requestAnimationFrame
 * leaves a real statistic reading zero -- a wrong number presented as fact.
 * See the same guard in ui/Counter.tsx.
 */
const FAILSAFE_MS = 2200;

export function AnimatedCounter({
  value,
  className,
  duration = 1.2,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);

  // From mount, not from `inView` -- the case being guarded against is
  // `inView` never becoming true.
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.textContent = String(value);
    }, FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (shouldReduceMotion) {
      ref.current.textContent = String(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = String(Math.round(latest));
      },
      // Rounding during the run can land a frame short of the target.
      onComplete: () => {
        if (ref.current) ref.current.textContent = String(value);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, motionValue, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
