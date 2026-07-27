"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient particle layer for the hero. Runs its own continuous rAF loop so
 * the hero still feels alive while the frame sequence is parked on a snap
 * point and nothing else on screen is moving.
 *
 * Reacts to two inputs:
 *  - scroll velocity -> particles stretch into light streaks and speed up,
 *    then settle back into a slow drift once scrolling stops.
 *  - pointer -> nearby particles are gently pushed away, with a soft glow
 *    trailing the cursor.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  depth: number; // 0..1, drives parallax + size + brightness
  phase: number; // twinkle offset
  twinkle: number; // twinkle speed
};

const MOBILE_BREAKPOINT = 768;
const DESKTOP_COUNT = 90;
const MOBILE_COUNT = 40;
const LINK_DISTANCE = 130; // px, constellation link radius
const POINTER_RADIUS = 150;

function makeParticle(w: number, h: number): Particle {
  // Bias toward smaller/dimmer so the field reads as depth, not confetti.
  const depth = Math.pow(Math.random(), 1.6);
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -0.05 - Math.random() * 0.12,
    size: 0.5 + depth * 2.1,
    alpha: 0.16 + depth * 0.55,
    depth,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.4 + Math.random() * 1.1,
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

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        particles = Array.from({ length: count }, () => makeParticle(width, height));
      }
    }

    // --- inputs -------------------------------------------------------
    let scrollVel = 0; // px per scroll event, decays to 0 each frame
    let lastScrollY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      scrollVel = Math.max(-90, Math.min(90, delta));
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
    // This loop is deliberately continuous (that is the whole point -- the
    // hero has to stay alive while the frame sequence is parked), so it is
    // gated on visibility: no work while the hero is scrolled away or the
    // tab is in the background.
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

    function tick(now: number) {
      // Normalized to 60fps so motion is frame-rate independent.
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;

      scrollVel *= 0.9;
      const speedBoost = 1 + Math.abs(scrollVel) * 0.05;

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Scroll pushes particles against the scroll direction, so the field
        // reads as the camera moving through space.
        p.x += p.vx * dt * speedBoost;
        p.y += (p.vy * speedBoost - scrollVel * 0.05 * p.depth) * dt;

        if (pointerActive) {
          const dx = p.x - pointerX;
          const dy = p.y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < POINTER_RADIUS * POINTER_RADIUS && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / POINTER_RADIUS) * 0.9 * p.depth;
            p.x += (dx / dist) * push * dt;
            p.y += (dy / dist) * push * dt;
          }
        }

        // Wrap with a small margin so particles don't pop at the edges.
        const m = 12;
        if (p.x < -m) p.x = width + m;
        else if (p.x > width + m) p.x = -m;
        if (p.y < -m) p.y = height + m;
        else if (p.y > height + m) p.y = -m;

        const twinkle = 0.72 + 0.28 * Math.sin(now * 0.001 * p.twinkle + p.phase);
        const alpha = p.alpha * twinkle;

        // Fast scroll stretches particles into motion-blurred streaks.
        const streak = Math.abs(scrollVel) * p.depth * 0.5;
        if (streak > 2) {
          const dir = scrollVel > 0 ? 1 : -1;
          ctx!.strokeStyle = `rgba(150, 200, 255, ${alpha})`;
          ctx!.lineWidth = p.size;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p.x, p.y + streak * dir);
          ctx!.stroke();
        } else {
          ctx!.fillStyle = `rgba(190, 220, 255, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Constellation links, nearest layer only to keep this cheap.
      ctx!.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.depth < 0.62) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (b.depth < 0.62) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > LINK_DISTANCE * LINK_DISTANCE) continue;
          const t = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
          ctx!.strokeStyle = `rgba(90, 160, 255, ${t * 0.16})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      // Soft glow trailing the cursor.
      if (pointerActive) {
        const g = ctx!.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, POINTER_RADIUS);
        g.addColorStop(0, "rgba(0, 130, 251, 0.10)");
        g.addColorStop(1, "rgba(0, 130, 251, 0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(pointerX, pointerY, POINTER_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
      }

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
