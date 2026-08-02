"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ParticleField } from "@/components/ui/ParticleField";
import { HeroHud } from "@/components/ui/HeroHud";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

const DESKTOP_FRAME_COUNT = 240;
const MOBILE_FRAME_COUNT = 120;
const MOBILE_BREAKPOINT = 768;
const SCROLL_VH = 260;
const LOAD_CONCURRENCY = 10;

type Status = "loading" | "ready" | "reduced";

type Phase = { start: number; end: number; fadeIn: number; fadeOut: number };

const PHASE_PRODUCT: Phase = { start: 0, end: 0.2, fadeIn: 0, fadeOut: 0.05 };
const PHASE_TRANSFORM: Phase = { start: 0.28, end: 0.56, fadeIn: 0.05, fadeOut: 0.05 };
const PHASE_SIGNAL: Phase = { start: 0.61, end: 0.83, fadeIn: 0.05, fadeOut: 0.05 };
const PHASE_LAUNCH: Phase = { start: 0.87, end: 1, fadeIn: 0.05, fadeOut: 0 };

// Where each story beat begins -- used for the ticks on the progress rail.
const PHASE_MARKERS = [
  PHASE_PRODUCT.start,
  PHASE_TRANSFORM.start,
  PHASE_SIGNAL.start,
  PHASE_LAUNCH.start,
];

/*
 * Playback model: scroll position is the single source of truth.
 *
 * Progress is a pure function of how far the pinned section has been
 * scrolled through, so frame 0 sits exactly at the top of the section and the
 * last frame exactly at the bottom. That coupling is what guarantees the
 * sequence always plays out completely before the next section can appear,
 * and -- just as importantly -- rewinds all the way to frame 0 before the
 * page can scroll back above the hero.
 *
 * A previous version advanced progress on a timer instead, which let the
 * frame index and the scroll position drift apart: you could reach the end of
 * the section with the animation only part-way through, and scrolling up left
 * it stranded mid-sequence.
 *
 * Automatic playback is layered on top as a gentle auto-scroll rather than a
 * separate progress clock. Moving the scroll position is what keeps the two
 * in lockstep -- anything else reintroduces exactly the drift described
 * above. It only runs once the user has scrolled at least once, pauses while
 * they are actively scrolling, and stops dead at the end of the sequence so
 * it never drags anyone out of the hero.
 */
const SMOOTHING = 14; // how fast the rendered frame chases the scroll target
const AUTOPLAY_SECONDS = 9; // a full automatic playthrough, start to finish
const AUTOPLAY_IDLE_MS = 700; // quiet period before autoplay picks up again

function pad(n: number) {
  return String(n).padStart(4, "0");
}

function frameUrl(isMobile: boolean, index: number) {
  return `/hero-frames/${isMobile ? "mobile" : "desktop"}/frame_${pad(index)}.webp`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      // decode() is a paint-jank optimization, not a correctness requirement
      // -- drawImage will decode synchronously if needed anyway. Some
      // environments never resolve/reject it, so race it against a timeout
      // rather than let one stuck image stall the whole preload queue.
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

async function loadSequence(
  urls: string[],
  concurrency: number,
  onEach: () => void
): Promise<HTMLImageElement[]> {
  const results: HTMLImageElement[] = new Array(urls.length);
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const i = cursor++;
      results[i] = await loadImage(urls[i]);
      onEach();
    }
  }

  await Promise.all(new Array(Math.min(concurrency, urls.length)).fill(0).map(worker));
  return results;
}

// Label for the HUD readout -- whichever story beat the scrub is nearest to.
function phaseLabel(p: number) {
  if (p < 0.24) return "Product";
  if (p < 0.585) return "Transform";
  if (p < 0.85) return "Signal";
  return "Launch";
}

function phaseOpacity(p: number, phase: Phase) {
  const { start, end, fadeIn, fadeOut } = phase;
  if (p < start - fadeIn || p > end + fadeOut) return 0;
  if (p < start) return fadeIn <= 0 ? 1 : (p - (start - fadeIn)) / fadeIn;
  if (p > end) return fadeOut <= 0 ? 1 : 1 - (p - end) / fadeOut;
  return 1;
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const canvasRatio = cw / ch;
  const imgRatio = img.width / img.height;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > canvasRatio) {
    sh = img.height;
    sw = sh * canvasRatio;
    sx = (img.width - sw) / 2;
  } else {
    sw = img.width;
    sh = sw / canvasRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export function Hero() {
  const openRoles = jobs.length + internships.length;

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(-1);
  const rawProgressRef = useRef(0);
  const renderProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [loadedPct, setLoadedPct] = useState(0);
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Kick off preload once on mount: check reduced-motion, pick a frame set for
  // the viewport, then load every frame with a bounded-concurrency queue.
  useEffect(() => {
    let cancelled = false;

    // Deferred a microtask so the state updates below happen from an async
    // continuation rather than synchronously in the effect body.
    Promise.resolve().then(() => {
      if (cancelled) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        setStatus("reduced");
        return;
      }

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const frameCount = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
      setPosterSrc(frameUrl(isMobile, 1));

      const urls = Array.from({ length: frameCount }, (_, i) => frameUrl(isMobile, i + 1));
      let loaded = 0;

      loadSequence(urls, LOAD_CONCURRENCY, () => {
        loaded += 1;
        if (!cancelled) setLoadedPct(Math.round((loaded / frameCount) * 100));
      })
        .then((images) => {
          if (cancelled) return;
          imagesRef.current = images;
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("reduced");
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-to-frame render loop. Only mounted once every frame is decoded.
  useEffect(() => {
    if (status !== "ready") return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    if (!section || !sticky || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // CSS scroll-behavior: smooth eases every wheel tick, which fights the
    // rAF/lerp scrubbing below over a tall pinned section. Scrubbing needs
    // the raw scrollTop, so switch to instant scrolling while this is live.
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const w = sticky!.clientWidth;
      const h = sticky!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      frameIndexRef.current = -1;
    }

    // Total scrollable distance through the pinned section, in px.
    function scrollSpan() {
      return Math.max(1, section!.getBoundingClientRect().height - sticky!.clientHeight);
    }

    function computeTargetProgress() {
      const rect = section!.getBoundingClientRect();
      const raw = -rect.top / Math.max(1, rect.height - sticky!.clientHeight);
      rawProgressRef.current = Math.min(1, Math.max(0, raw));
    }

    // --- playback state ----------------------------------------------
    let started = false;
    let lastScrollY = window.scrollY;
    // px of scroll this component applied itself and has not yet seen come
    // back through the scroll event -- subtracted out so autoplay doesn't
    // read its own movement as the user taking over.
    let selfScrolled = 0;
    let lastUserScrollAt = 0;
    let lastSync = 0;
    let lastFrameTime = performance.now();
    let onScreen = true;
    let running = false;

    function onScroll() {
      const y = window.scrollY;
      const userDelta = y - lastScrollY - selfScrolled;
      lastScrollY = y;
      selfScrolled = 0;

      if (Math.abs(userDelta) > 0.5) {
        lastUserScrollAt = performance.now();
        // The hero holds on frame 0 until the first real scroll.
        started = true;
      }

      computeTargetProgress();
      start();
    }

    function tick(now: number) {
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      computeTargetProgress();
      const target = rawProgressRef.current;

      // Autoplay: nudge the scroll position forward, never the frame index
      // directly, so progress and scroll can't come apart.
      //
      // "Pending" covers the window where autoplay is merely waiting out the
      // user's last scroll. The loop has to stay alive through that wait --
      // idling out there would mean nothing ever restarts it and autoplay
      // would silently never resume.
      const autoplayPending =
        started && onScreen && target < 1 && section!.getBoundingClientRect().top <= 0;
      const autoplaying = autoplayPending && now - lastUserScrollAt > AUTOPLAY_IDLE_MS;

      if (autoplaying) {
        const step = (scrollSpan() / AUTOPLAY_SECONDS) * dt;
        const before = window.scrollY;
        window.scrollBy(0, step);
        // Whatever the browser actually applied (it clamps at the document
        // end) is what we have to discount from the next scroll event.
        selfScrolled += window.scrollY - before;
        computeTargetProgress();
      }

      // Ease the rendered frame toward the scroll target. Frame-rate
      // independent, and it always converges on the target rather than
      // accumulating its own position.
      const k = 1 - Math.exp(-SMOOTHING * dt);
      const current = renderProgressRef.current;
      const next = current + (rawProgressRef.current - current) * k;
      renderProgressRef.current =
        Math.abs(rawProgressRef.current - next) < 0.0004 ? rawProgressRef.current : next;

      const images = imagesRef.current;
      if (images.length > 0) {
        const idx = Math.min(
          images.length - 1,
          Math.max(0, Math.round(renderProgressRef.current * (images.length - 1)))
        );
        if (idx !== frameIndexRef.current) {
          const img = images[idx];
          if (img && img.complete && canvas!.width > 0) {
            drawCover(ctx!, img, canvas!.width, canvas!.height);
            frameIndexRef.current = idx;
          }
        }
      }

      if (now - lastSync > 32) {
        lastSync = now;
        setProgress(renderProgressRef.current);
      }

      // Idle out once the frame has caught up and autoplay has nothing left
      // to do; the scroll listener restarts the loop.
      if (!autoplayPending && renderProgressRef.current === rawProgressRef.current) {
        running = false;
        return;
      }

      if (running) rafRef.current = requestAnimationFrame(tick);
    }

    function start() {
      if (running || !onScreen || document.hidden) return;
      running = true;
      lastFrameTime = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    function onResize() {
      resizeCanvas();
      computeTargetProgress();
      start();
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 }
    );

    resizeCanvas();
    computeTargetProgress();

    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [status]);

  if (status === "reduced") {
    return <StaticHero openRoles={openRoles} />;
  }

  const opProduct = phaseOpacity(progress, PHASE_PRODUCT);
  const opTransform = phaseOpacity(progress, PHASE_TRANSFORM);
  const opSignal = phaseOpacity(progress, PHASE_SIGNAL);
  const opLaunch = phaseOpacity(progress, PHASE_LAUNCH);

  return (
    <section ref={sectionRef} className="relative bg-[#020308]" style={{ height: `${SCROLL_VH}vh` }}>
      <div ref={stickyRef} className="sticky top-0 h-dvh w-full overflow-hidden">
        {posterSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- drawn as a raster backdrop before the canvas takes over, not an optimizable next/image use case
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="ProEduvate product interfaces dissolving into the ProEduvate signal mark"
        />

        {/* Breathing aurora glows — keep the frame feeling lit while parked. */}
        <div
          aria-hidden="true"
          className="animate-[--animate-aurora] pointer-events-none absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] rounded-full blur-[130px]"
          style={{ background: "color-mix(in srgb, var(--color-accent) 42%, transparent)" }}
        />
        <div
          aria-hidden="true"
          className="animate-[--animate-aurora-slow] pointer-events-none absolute -right-1/4 -bottom-1/4 h-[60vh] w-[60vh] rounded-full blur-[140px]"
          style={{ background: "color-mix(in srgb, var(--color-primary-2) 60%, transparent)" }}
        />

        {/* Ambient particles — own rAF loop, so the hero stays alive between snaps. */}
        <ParticleField className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* Legibility scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent"
        />

        {/* Film grain for a bit of texture over the flat gradients. */}
        <div
          aria-hidden="true"
          className="bg-grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        />

        {/* Synthetic HUD — scan sweep, brackets, live readout. */}
        <HeroHud
          progress={progress}
          label={phaseLabel(progress)}
          showTelemetry={status === "ready"}
        />

        {/* Phase 1: Product */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            opacity: opProduct,
            transform: `translateY(${(1 - opProduct) * -16}px)`,
            pointerEvents: opProduct > 0.5 ? "auto" : "none",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.68) 38%, rgba(0,0,0,0.25) 62%, transparent 78%)",
            }}
          />
          <Container className="relative z-10 pt-24">
            <Badge tone="outline" className="mb-6">
              AI-Powered Product Company
            </Badge>
            <h1 className="text-balance max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl">
              Building the future of learning and enterprise technology.
            </h1>
            <p className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
              ProEduvate designs and ships AI-native products for EdTech and enterprise, and
              partners with institutions and companies who need the same craft applied to their
              own software.
            </p>
          </Container>
        </div>

        {/* Phase 2: Transform */}
        <div
          className="absolute inset-0 flex items-center justify-center text-center"
          style={{
            opacity: opTransform,
            transform: `translateY(${(1 - opTransform) * 16}px)`,
          }}
        >
          <Container className="relative z-10">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent-2 uppercase">
              How we work
            </p>
            <h2 className="text-balance mx-auto max-w-2xl text-3xl font-medium text-white sm:text-5xl">
              Every product we ship dissolves into one system of intelligence.
            </h2>
          </Container>
        </div>

        {/* Phase 3: Signal */}
        <div
          className="absolute inset-0 flex items-center justify-center text-center"
          style={{
            opacity: opSignal,
            transform: `translateY(${(1 - opSignal) * 16}px)`,
          }}
        >
          <Container className="relative z-10">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent-2 uppercase">
              Our signal
            </p>
            <h2 className="text-balance mx-auto max-w-xl text-4xl font-medium text-white sm:text-6xl">
              This is ProEduvate.
            </h2>
            <p className="text-balance mx-auto mt-4 max-w-md text-lg text-gray-200">
              One team. One system. Built to move fast without breaking what matters.
            </p>
          </Container>
        </div>

        {/* Phase 4: Launch */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            opacity: opLaunch,
            transform: `translateY(${(1 - opLaunch) * 16}px)`,
            pointerEvents: opLaunch > 0.5 ? "auto" : "none",
          }}
        >
          <Container className="relative z-10">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent-2 uppercase">
              Always shipping
            </p>
            <h2 className="text-balance max-w-3xl text-4xl font-medium text-white sm:text-6xl">
              Always moving forward.
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/products" size="lg">
                Explore Our Products
              </Button>
              <Button href="/careers" variant="outline-light" size="lg">
                We&apos;re Hiring
              </Button>
            </div>
          </Container>
        </div>

        {/* Progress rail */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-6 hidden h-40 w-px -translate-y-1/2 bg-white/15 md:block"
          style={{ opacity: progress > 0.02 && progress < 0.99 ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <div
            className="w-px bg-accent-2"
            style={{ height: `${progress * 100}%` }}
          />
          {/* Tick per story beat, lit once playback reaches it. */}
          {PHASE_MARKERS.map((point) => {
            const reached = progress >= point - 0.02;
            return (
              <span
                key={point}
                className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rotate-45 border transition-colors duration-300"
                style={{
                  top: `${point * 100}%`,
                  borderColor: reached ? "var(--color-accent-2)" : "rgba(255,255,255,0.3)",
                  background: reached ? "var(--color-accent-2)" : "transparent",
                }}
              />
            );
          })}
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
          aria-hidden="true"
          style={{ opacity: progress < 0.04 ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </div>

        {/* Loading indicator */}
        {status === "loading" && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-6 py-4 text-xs text-white/50">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent-2 transition-[width] duration-200 ease-out"
                style={{ width: `${loadedPct}%` }}
              />
            </div>
            <span className="tabular-nums">{loadedPct}%</span>
          </div>
        )}
      </div>
    </section>
  );
}

function StaticHero({ openRoles }: { openRoles: number }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
        }}
      />

      <Container className="relative z-10 pt-24">
        <Badge tone="outline" className="mb-6">
          AI-Powered Product Company
        </Badge>
        <h1 className="text-balance max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl">
          Building the future of learning and enterprise technology.
        </h1>
        <p className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
          ProEduvate designs and ships AI-native products for EdTech and enterprise, and partners
          with institutions and companies who need the same craft applied to their own software.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/products" size="lg">
            Explore Our Products
          </Button>
          <Button href="/careers" variant="outline-light" size="lg">
            We&apos;re Hiring
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
              {openRoles}
            </span>
          </Button>
        </div>
      </Container>
    </section>
  );
}
