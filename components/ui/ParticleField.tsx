"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient particle layer for the hero. Runs its own continuous rAF loop so
 * the hero still feels alive while the frame sequence is parked on a snap
 * point and nothing else on screen is moving.
 *
 * The hero frames already contain a dense starfield, so plain small dots
 * disappear into them. Everything here is drawn additively (`lighter`) from
 * pre-rendered glow sprites instead, which reads as light *on top of* the
 * footage rather than more stars inside it.
 *
 * Reacts to two inputs:
 *  - scroll velocity -> particles stretch into light streaks and speed up,
 *    then settle back into a slow drift once scrolling stops.
 *  - pointer -> nearby particles are pushed away, with a glow trailing the
 *    cursor.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  depth: number; // 0..1, drives parallax + size + brightness
  phase: number; // twinkle offset
  twinkle: number; // twinkle speed
};

type Orb = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
};

const MOBILE_BREAKPOINT = 768;
const DESKTOP_COUNT = 70;
const MOBILE_COUNT = 32;
const DESKTOP_ORBS = 7;
const MOBILE_ORBS = 3;
const LINK_DISTANCE = 150;
const POINTER_RADIUS = 190;
const SPRITE_SIZE = 64;

/** Pre-rendered radial glow, drawn scaled per particle -- far cheaper than
 *  building a gradient every frame. */
function makeGlowSprite(r: number, g: number, b: number, falloff: number) {
  const c = document.createElement("canvas");
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const half = SPRITE_SIZE / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  grad.addColorStop(falloff, `rgba(${r}, ${g}, ${b}, 0.28)`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return c;
}

function makeParticle(w: number, h: number): Particle {
  const depth = Math.pow(Math.random(), 1.4);
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.16,
    vy: -0.06 - Math.random() * 0.16,
    radius: 1.4 + depth * 3.4,
    alpha: 0.35 + depth * 0.55,
    depth,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.5 + Math.random() * 1.3,
  };
}

function makeOrb(w: number, h: number): Orb {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.09,
    vy: -0.03 - Math.random() * 0.07,
    radius: 26 + Math.random() * 62,
    alpha: 0.1 + Math.random() * 0.14,
    phase: Math.random() * Math.PI * 2,
  };
}

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
    const orbCount = isMobile ? MOBILE_ORBS : DESKTOP_ORBS;

    const sparkSprite = makeGlowSprite(214, 234, 255, 0.22);
    const orbSprite = makeGlowSprite(64, 156, 255, 0.42);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let orbs: Orb[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        particles = Array.from({ length: count }, () => makeParticle(width, height));
        orbs = Array.from({ length: orbCount }, () => makeOrb(width, height));
      }
    }

    // --- inputs -------------------------------------------------------
    let scrollVel = 0; // px per scroll event, decays to 0 each frame
    let lastScrollY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      scrollVel = Math.max(-90, Math.min(90, y - lastScrollY));
      lastScrollY = y;
    }

    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      pointerActive = true;
    }
    function onPointerLeave() {
      pointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
    }

    // --- render loop --------------------------------------------------
    // Deliberately continuous (that is the whole point -- the hero has to
    // stay alive while the frame sequence is parked), so it is gated on
    // visibility: no work while the hero is scrolled away or the tab is
    // in the background.
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    let running = false;

    function start() {
      if (running || !onScreen || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function drawGlow(sprite: HTMLCanvasElement, x: number, y: number, radius: number, alpha: number) {
      ctx!.globalAlpha = alpha;
      ctx!.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    }

    function tick(now: number) {
      // Normalized to 60fps so motion is frame-rate independent.
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;

      scrollVel *= 0.9;
      const speedBoost = 1 + Math.abs(scrollVel) * 0.055;

      ctx!.clearRect(0, 0, width, height);
      // Additive so every layer reads as emitted light over the footage.
      ctx!.globalCompositeOperation = "lighter";

      // Big soft bokeh orbs, drifting behind the sparks.
      for (const o of orbs) {
        o.x += o.vx * dt * speedBoost;
        o.y += (o.vy * speedBoost - scrollVel * 0.03) * dt;
        const m = o.radius;
        if (o.x < -m) o.x = width + m;
        else if (o.x > width + m) o.x = -m;
        if (o.y < -m) o.y = height + m;
        else if (o.y > height + m) o.y = -m;

        const breathe = 0.75 + 0.25 * Math.sin(now * 0.0004 + o.phase);
        drawGlow(orbSprite, o.x, o.y, o.radius * breathe, o.alpha * breathe);
      }

      // Constellation links, drawn under the sparks.
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.depth < 0.55) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (b.depth < 0.55) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > LINK_DISTANCE * LINK_DISTANCE) continue;
          const t = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
          ctx!.globalAlpha = 1;
          ctx!.strokeStyle = `rgba(90, 170, 255, ${t * 0.5})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      for (const p of particles) {
        // Scroll pushes particles against the scroll direction, so the field
        // reads as the camera moving through space.
        p.x += p.vx * dt * speedBoost;
        p.y += (p.vy * speedBoost - scrollVel * 0.06 * p.depth) * dt;

        if (pointerActive) {
          const dx = p.x - pointerX;
          const dy = p.y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < POINTER_RADIUS * POINTER_RADIUS && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / POINTER_RADIUS) * 1.6 * p.depth;
            p.x += (dx / dist) * push * dt;
            p.y += (dy / dist) * push * dt;
          }
        }

        const m = 20;
        if (p.x < -m) p.x = width + m;
        else if (p.x > width + m) p.x = -m;
        if (p.y < -m) p.y = height + m;
        else if (p.y > height + m) p.y = -m;

        const twinkle = 0.62 + 0.38 * Math.sin(now * 0.0011 * p.twinkle + p.phase);
        const alpha = p.alpha * twinkle;

        // Fast scroll smears particles into streaks of light.
        const streak = Math.abs(scrollVel) * p.depth * 0.6;
        if (streak > 3) {
          const dir = scrollVel > 0 ? 1 : -1;
          ctx!.globalAlpha = alpha * 0.85;
          ctx!.strokeStyle = "rgba(190, 224, 255, 1)";
          ctx!.lineWidth = p.radius * 1.5;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p.x, p.y + streak * dir);
          ctx!.stroke();
        } else {
          // Wide soft halo plus a tight bright core.
          drawGlow(sparkSprite, p.x, p.y, p.radius * 4.5, alpha * 0.55);
          drawGlow(sparkSprite, p.x, p.y, p.radius * 1.15, alpha);
        }
      }

      // Glow trailing the cursor.
      if (pointerActive) {
        drawGlow(orbSprite, pointerX, pointerY, POINTER_RADIUS * 0.85, 0.16);
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";

      if (running) raf = requestAnimationFrame(tick);
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

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
