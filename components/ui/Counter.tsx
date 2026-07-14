"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "framer-motion";

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
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, motionValue, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
