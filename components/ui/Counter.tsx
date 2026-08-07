"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "framer-motion";

/*
 * How long after mount to force the true figure on screen regardless.
 *
 * The rendered text starts at "0" and is only ever replaced by the animation
 * callback, so anything that stops the animation running -- an
 * IntersectionObserver that never fires, a backgrounded tab freezing
 * requestAnimationFrame, an interrupted route change -- leaves a real
 * statistic reading zero. "Projects Built: 0" is worse than no animation:
 * it is a wrong number presented as fact. This guarantees the figure is
 * correct even when the motion never happens.
 *
 * Comfortably longer than `duration`, so it never cuts a running count short.
 */
const FAILSAFE_MS = 2800;

export function Counter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);

  // Runs from mount, not from `inView`, precisely because the case being
  // guarded against is `inView` never becoming true.
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
    }, FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [value, suffix]);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
      // Rounding during the run can land a frame short of the target.
      onComplete() {
        if (ref.current) ref.current.textContent = `${value}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, motionValue, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
