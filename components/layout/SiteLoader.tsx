"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LogoLoaderScene = dynamic(() => import("@/components/ui/LogoLoaderScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Full-screen preloader shown on first paint and dismissed once the window
 * has loaded. The progress figure is a smoothed synthetic ramp that latches
 * to 100% on the real `load` event -- browsers give no reliable overall
 * progress signal, and a bar that stalls at a real-but-meaningless number
 * looks broken.
 *
 * Skipped entirely for reduced-motion, and hard-capped by a timeout so a
 * hung asset can never leave the site behind a curtain.
 */
const MAX_VISIBLE_MS = 6000;

export function SiteLoader() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      // Deferred a microtask so this doesn't setState synchronously in the
      // effect body (which would cascade an extra render).
      Promise.resolve().then(() => setVisible(false));
      return;
    }

    let raf = 0;
    let value = 0;
    let last = performance.now();

    function finish() {
      loadedRef.current = true;
    }

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    // Failsafe: dismiss directly rather than flipping a flag the rAF loop has
    // to notice. requestAnimationFrame is throttled or paused in background
    // tabs, so a rAF-dependent dismissal can leave the curtain up over the
    // whole site.
    const cap = setTimeout(() => {
      loadedRef.current = true;
      setProgress(1);
      setVisible(false);
    }, MAX_VISIBLE_MS);

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Ease toward 90% while loading, then run to 100% once actually loaded.
      const target = loadedRef.current ? 1 : 0.9;
      value += (target - value) * (loadedRef.current ? 6 : 1.1) * dt;
      setProgress(value);

      if (value > 0.995) {
        setProgress(1);
        setTimeout(() => setVisible(false), 420);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, [shouldReduceMotion]);

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[40vh] w-[40vh] rounded-full opacity-30 blur-[110px]"
            style={{ background: "var(--color-accent)" }}
          />

          <div className="relative h-[46vh] max-h-[420px] w-full max-w-[420px]">
            <LogoLoaderScene progress={progress} />
          </div>

          <div className="relative mt-2 flex flex-col items-center gap-4">
            <p className="label-micro text-accent">Initialising</p>
            <div className="h-px w-52 overflow-hidden bg-white/10">
              <div
                className="h-px bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="label-micro text-gray-500 tabular-nums">
              {String(pct).padStart(3, "0")}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
