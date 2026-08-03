"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  getHeroFramesServerSnapshot,
  getHeroFramesSnapshot,
  startHeroFramePreload,
  subscribeHeroFrames,
} from "@/lib/hero-frames";

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

/*
 * The hero sequence is very large, so waiting on it needs its own, much
 * longer ceiling than the ordinary `window.load` wait. If it blows past this
 * the curtain lifts anyway and the hero falls back to showing its own
 * progress bar over the poster -- a slow connection should not be able to
 * lock someone out of the site.
 */
const MAX_FRAME_WAIT_MS = 25000;

/*
 * Stall guard.
 *
 * The hard cap above only helps if the download is merely slow. If it stops
 * dead -- a stalled connection, a request queue that never drains, a device
 * that refuses to decode -- the curtain would sit at whatever percentage it
 * reached, and at 0% that looks exactly like a broken site with nothing on
 * it. So progress is watched directly: if the figure has not moved at all for
 * this long, the curtain lifts regardless and the hero falls back to its own
 * progress bar over the poster frame.
 */
const STALL_MS = 7000;

// Content fades before the curtain does. Tearing a WebGL context down while
// its canvas is still partly visible flashes, so the scene is fully
// transparent by the time the overlay unmounts.
const EXIT_FADE_MS = 300;

export function SiteLoader() {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  // Only the home page has the frame sequence, so only it is worth holding
  // the curtain for. Every other route would be waiting on a download it
  // never uses.
  const gateOnFrames = pathname === "/";

  const frames = useSyncExternalStore(
    subscribeHeroFrames,
    getHeroFramesSnapshot,
    getHeroFramesServerSnapshot
  );

  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [ramp, setRamp] = useState(0);

  // Start the sequence download from here rather than waiting for the hero to
  // mount and ask for it -- this is the whole point of the coordination.
  useEffect(() => {
    if (gateOnFrames && !shouldReduceMotion) startHeroFramePreload();
  }, [gateOnFrames, shouldReduceMotion]);

  // window.load
  useEffect(() => {
    if (document.readyState === "complete") {
      const t = setTimeout(() => setPageLoaded(true), 0);
      return () => clearTimeout(t);
    }
    function onLoad() {
      setPageLoaded(true);
    }
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // Hard ceiling, so nothing can leave the site behind the curtain. Driven by
  // a timer rather than rAF: rAF is throttled to nothing in a background tab,
  // and a rAF-dependent dismissal would never fire there.
  useEffect(() => {
    const t = setTimeout(
      () => setCapReached(true),
      gateOnFrames ? MAX_FRAME_WAIT_MS : MAX_VISIBLE_MS
    );
    return () => clearTimeout(t);
  }, [gateOnFrames]);

  // Synthetic ramp, used only where there is no real figure to report.
  useEffect(() => {
    if (gateOnFrames) return;
    let raf = 0;
    let value = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      value += ((pageLoaded ? 1 : 0.9) - value) * (pageLoaded ? 6 : 1.1) * dt;
      setRamp(value);
      if (value < 0.995) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gateOnFrames, pageLoaded]);

  const framesSettled =
    frames.status === "ready" || frames.status === "reduced" || frames.status === "failed";
  const frameProgress = frames.total === 0 ? 0 : frames.loaded / frames.total;

  // Restarted every time `frames.loaded` changes, so it only ever fires when
  // the count has genuinely sat still -- including at zero, which is the case
  // that looks like a dead page.
  useEffect(() => {
    if (!gateOnFrames || framesSettled) return;
    const t = setTimeout(() => setStalled(true), STALL_MS);
    return () => clearTimeout(t);
  }, [gateOnFrames, framesSettled, frames.loaded]);

  const progress = gateOnFrames ? frameProgress : ramp;
  const ready =
    shouldReduceMotion ||
    capReached ||
    stalled ||
    (pageLoaded && (!gateOnFrames || framesSettled));

  useEffect(() => {
    if (!ready) return;
    // Timer callbacks rather than the effect body, so this never sets state
    // synchronously during the effect.
    //
    // Deliberately no "already dismissed" ref guard: in StrictMode the effect
    // is mounted, cleaned up, then mounted again, and a ref that survives the
    // cleanup would make the second run bail out after the first run's
    // cleanup had already cancelled these timers -- leaving the curtain up
    // forever. Rescheduling on every run is what makes it re-entrant.
    const t1 = setTimeout(() => setExiting(true), 0);
    const t2 = setTimeout(() => setVisible(false), EXIT_FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  const pct = Math.round((exiting ? 1 : progress) * 100);
  const label = gateOnFrames && !framesSettled ? "Loading sequence" : "Initialising";

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

          <div
            className="relative h-[46vh] max-h-[420px] w-full max-w-[420px] transition-opacity ease-out"
            style={{
              opacity: exiting ? 0 : 1,
              transitionDuration: `${EXIT_FADE_MS - 60}ms`,
            }}
          >
            <LogoLoaderScene progress={progress} />
          </div>

          <div
            className="relative mt-2 flex flex-col items-center gap-4 transition-opacity ease-out"
            style={{
              opacity: exiting ? 0 : 1,
              transitionDuration: `${EXIT_FADE_MS - 60}ms`,
            }}
          >
            <p className="label-micro text-accent">{label}</p>
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
