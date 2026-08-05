"use client";

import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Accessibility,
  Stethoscope,
  Code2,
  BrainCircuit,
  UsersRound,
  Cloud,
  Database,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BracketFrame } from "@/components/ui/BracketFrame";
import { cn } from "@/lib/utils";
import { sectors } from "@/data/sectors";

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  accessibility: Accessibility,
  stethoscope: Stethoscope,
  code: Code2,
  "brain-circuit": BrainCircuit,
  users: UsersRound,
  cloud: Cloud,
  database: Database,
};

/*
 * The sectors on a rotating 3D carousel.
 *
 * Built with CSS 3D transforms rather than WebGL on purpose: the content is
 * short text that has to stay crisp, selectable, focusable and in the
 * accessibility tree. Rendering it into a WebGL texture would cost all four
 * and force a separate DOM mirror for screen readers. Real perspective plus
 * preserve-3d gives the same depth for none of that.
 */
const STEP = 360 / sectors.length;
const RADIUS = 430; // px from ring centre to each tile
const BASE_SPEED = 5.5; // degrees per second at rest
const SCROLL_IMPULSE = 0.07; // degrees added per px of scroll
const MOMENTUM_DECAY = 2.6; // per second

export function SectorRing() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  // Mirrored into a ref so the rAF loop can read it without being torn down
  // and restarted every time the hovered tile changes.
  const activeRef = useRef<number | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring) return;

    let rotation = 0;
    let momentum = 0;
    let lastScrollY = window.scrollY;
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    let running = false;

    function onScroll() {
      const y = window.scrollY;
      momentum += (y - lastScrollY) * SCROLL_IMPULSE;
      lastScrollY = y;
      start();
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Hovering parks the ring so the card can be read.
      const idle = activeRef.current === null;
      momentum -= momentum * Math.min(1, MOMENTUM_DECAY * dt);
      rotation += (idle ? BASE_SPEED * dt : 0) + momentum * dt;

      ring!.style.transform = `translateZ(-${RADIUS}px) rotateY(${rotation}deg)`;

      // Depth cue: tiles facing away from the camera recede.
      for (let i = 0; i < tileRefs.current.length; i++) {
        const tile = tileRefs.current[i];
        if (!tile) continue;
        const angle = ((i * STEP + rotation) % 360 + 360) % 360;
        // 1 at the front, 0 at the back.
        const facing = (Math.cos((angle * Math.PI) / 180) + 1) / 2;
        tile.style.opacity = String(0.18 + facing * 0.82);
        tile.style.filter = `blur(${(1 - facing) * 2.4}px)`;
        tile.style.zIndex = String(Math.round(facing * 100));
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !onScreen || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
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
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [shouldReduceMotion]);

  const activeSector = active === null ? null : sectors[active];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <BracketFrame inset="inset-8" />

      <Container className="relative">
        <SectionHeading
          index="01"
          eyebrow="What We Do"
          title="Eight sectors. One standard of craft."
          description="ProEduvate builds and ships across eight sectors, applying the same standard of craft to our own products and to client work alike."
        />
      </Container>

      {shouldReduceMotion ? (
        // Static fallback: the same content as a plain list.
        <Container className="relative mt-16">
          <ul className="grid grid-cols-1 gap-px border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, i) => {
              const Icon = iconMap[sector.icon];
              return (
                <li key={sector.title} className="border-b border-white/10 py-8 sm:px-6">
                  <span className="label-micro text-gray-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="mt-4 h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl text-chalk">{sector.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{sector.description}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      ) : (
        <div className="relative mt-20 md:mt-24">
          {/* Stage */}
          <div
            className="relative mx-auto h-[300px] w-full"
            style={{ perspective: "2100px", perspectiveOrigin: "50% 45%" }}
          >
            <div
              ref={ringRef}
              className="absolute top-0 left-1/2 h-full w-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {sectors.map((sector, i) => {
                const Icon = iconMap[sector.icon];
                const isActive = active === i;
                return (
                  <div
                    key={sector.title}
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    className="absolute top-0 left-0 -ml-[130px] w-[260px]"
                    style={{
                      transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
                    }}
                  >
                    <button
                      type="button"
                      // Pointer events rather than mouse events so pen input
                      // works too; tap toggles, since touch has no hover at
                      // all and would otherwise never reach the detail card.
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "touch") setActive(i);
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType !== "touch") setActive(null);
                      }}
                      onClick={() => setActive((prev) => (prev === i ? null : i))}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      aria-expanded={isActive}
                      aria-label={`${sector.title}. ${sector.description}`}
                      className={cn(
                        "group flex h-[240px] w-full flex-col items-start justify-between border p-6 text-left transition-colors duration-300",
                        isActive
                          ? "border-accent bg-accent/[0.08]"
                          : "border-white/12 bg-white/[0.03] hover:border-accent/50"
                      )}
                    >
                      <span className="label-micro text-gray-500 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        className={cn(
                          "h-8 w-8 transition-colors duration-300",
                          isActive ? "text-accent" : "text-accent/70"
                        )}
                        aria-hidden="true"
                      />
                      <span className="font-display text-xl leading-tight text-chalk">
                        {sector.title}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail card, popped in on hover/focus. */}
          <Container className="relative mt-10 min-h-[132px]">
            <AnimatePresence mode="wait">
              {activeSector ? (
                <motion.div
                  key={activeSector.title}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-w-xl border border-accent/40 bg-surface-2 p-7 text-center"
                >
                  <p className="label-micro text-accent">
                    Sector {String((active ?? 0) + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-chalk">{activeSector.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {activeSector.description}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="label-micro text-center text-gray-600"
                >
                  Hover a sector to inspect it · scroll to rotate
                </motion.p>
              )}
            </AnimatePresence>
          </Container>
        </div>
      )}
    </section>
  );
}
