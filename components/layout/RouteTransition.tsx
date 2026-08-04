"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/*
 * ProEduvate curtain shown when moving between pages.
 *
 * Deliberately CSS/DOM only, not the WebGL scene the first-load preloader
 * uses: this runs on every navigation, and standing up a WebGL context each
 * time would cost more than the transition it is covering.
 *
 * The very first pathname is skipped. On a cold load the SiteLoader curtain
 * is already up, and running both would show two loaders back to back.
 */

const HOLD_MS = 620;

export function RouteTransition() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // First run just records where we started -- no curtain on cold load.
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    if (shouldReduceMotion) return;

    // Both transitions go through timer callbacks rather than the effect
    // body, so neither sets state synchronously during the effect.
    const show = setTimeout(() => setVisible(true), 0);
    const hide = setTimeout(() => setVisible(false), HOLD_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [pathname, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-curtain"
          className="pointer-events-none fixed inset-0 z-[190] flex items-center justify-center bg-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="bg-grid pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[35vh] w-[35vh] rounded-full opacity-30 blur-[110px]"
            style={{ background: "var(--color-accent)" }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Ring sweeping around the mark */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-3 rounded-full border border-accent/20"
              />
              <motion.div
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/icon.png"
                  alt=""
                  width={128}
                  height={128}
                  priority
                  className="h-14 w-14 object-contain"
                />
              </motion.div>
            </div>

            <motion.div
              className="h-px w-40 overflow-hidden bg-white/10"
              aria-hidden="true"
            >
              <motion.span
                className="block h-px bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: HOLD_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>

          {/* Announce the change for screen readers without describing chrome. */}
          <span className="sr-only" role="status">
            Loading page
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
