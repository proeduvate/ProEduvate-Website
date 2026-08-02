/*
 * Shared owner of the hero frame sequence.
 *
 * The preload used to live inside the Hero component, which meant it only
 * started once the hero mounted and ran on its own clock -- the site loader
 * dismissed on `window.load`, and the frames carried on downloading behind an
 * already-visible page. The user was left watching a poster with a progress
 * bar under it.
 *
 * Hoisting it here lets the loader subscribe to the same progress the hero
 * consumes, so the curtain can stay up until the sequence is actually
 * playable, and the hero can render straight from decoded images.
 *
 * This is a module-level store rather than context because the preload has to
 * survive route changes and must never restart: re-running it would refetch
 * a very large sequence.
 */

export const DESKTOP_FRAME_COUNT = 240;
export const MOBILE_FRAME_COUNT = 120;
export const MOBILE_BREAKPOINT = 768;
const LOAD_CONCURRENCY = 10;

export type HeroFramesStatus = "idle" | "loading" | "ready" | "reduced" | "failed";

export type HeroFramesSnapshot = {
  status: HeroFramesStatus;
  loaded: number;
  total: number;
  /** First frame, usable as a poster the moment it is known. */
  poster: string | null;
};

const IDLE: HeroFramesSnapshot = { status: "idle", loaded: 0, total: 0, poster: null };

let snapshot: HeroFramesSnapshot = IDLE;
let images: HTMLImageElement[] = [];
let started = false;
const listeners = new Set<() => void>();

function emit(next: HeroFramesSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeHeroFrames(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Must return a stable reference between changes -- useSyncExternalStore
// re-renders in a loop otherwise.
export function getHeroFramesSnapshot() {
  return snapshot;
}

export function getHeroFramesServerSnapshot() {
  return IDLE;
}

export function getHeroImages() {
  return images;
}

function pad(n: number) {
  return String(n).padStart(4, "0");
}

export function frameUrl(isMobile: boolean, index: number) {
  return `/hero-frames/${isMobile ? "mobile" : "desktop"}/frame_${pad(index)}.webp`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      // decode() is a paint-jank optimization, not a correctness requirement
      // -- drawImage decodes synchronously if it has to. Some environments
      // never settle it, so race a timeout rather than let one stuck image
      // stall the whole queue.
      if (typeof img.decode === "function") {
        const decoded = img.decode().catch(() => {});
        const timeout = new Promise<void>((r) => setTimeout(r, 1500));
        Promise.race([decoded, timeout]).then(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Idempotent. Safe to call from every component that depends on the sequence;
 * only the first call does any work.
 */
export function startHeroFramePreload() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    emit({ status: "reduced", loaded: 0, total: 0, poster: null });
    return;
  }

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const total = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const poster = frameUrl(isMobile, 1);
  emit({ status: "loading", loaded: 0, total, poster });

  const urls = Array.from({ length: total }, (_, i) => frameUrl(isMobile, i + 1));
  const results: HTMLImageElement[] = new Array(total);
  let cursor = 0;
  let loaded = 0;
  let lastEmittedPct = -1;

  async function worker() {
    while (cursor < urls.length) {
      const i = cursor++;
      results[i] = await loadImage(urls[i]);
      loaded += 1;
      // Emitting per frame would re-render subscribers 240 times; whole
      // percentage points are all the UI can show anyway.
      const pct = Math.round((loaded / total) * 100);
      if (pct !== lastEmittedPct) {
        lastEmittedPct = pct;
        emit({ status: "loading", loaded, total, poster });
      }
    }
  }

  Promise.all(new Array(Math.min(LOAD_CONCURRENCY, urls.length)).fill(0).map(worker))
    .then(() => {
      images = results;
      emit({ status: "ready", loaded: total, total, poster });
    })
    .catch(() => {
      emit({ status: "failed", loaded, total, poster });
    });
}
