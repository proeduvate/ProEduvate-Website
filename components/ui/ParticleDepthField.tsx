"use client";

import { useEffect, useRef } from "react";

/*
 * Additive 2D-canvas particle field with fake depth.
 *
 * Each particle carries a z, which drives its projected size, brightness and
 * drift speed, so the field reads as a volume rather than a flat sprinkle.
 * Particles that pass the camera wrap back to the far plane.
 *
 * Canvas rather than DOM nodes because a few hundred elements animating every
 * frame is where layout/paint cost stops being free. Pre-rendered glow
 * sprites composited with `lighter` -- drawing a radial gradient per particle
 * per frame is the expensive way to do this.
 */

const COUNT = 150;
const NEAR = 0.6;
const FAR = 5;

type Particle = { x: number; y: number; z: number; speed: number; twinkle: number };

function makeSprite(colour: string, size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, colour);
  g.addColorStop(0.35, colour.replace(/[\d.]+\)$/, "0.35)"));
  g.addColorStop(1, colour.replace(/[\d.]+\)$/, "0)"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export function ParticleDepthField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const sprite = makeSprite("rgba(120,190,255,0.9)", 64);
    const spriteAccent = makeSprite("rgba(0,130,251,0.9)", 64);

    // Deterministic seeding keeps SSR and client identical and makes the
    // layout reproducible between reloads.
    let seed = 20260803;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: rand() * 2 - 1,
      y: rand() * 2 - 1,
      z: NEAR + rand() * (FAR - NEAR),
      speed: 0.12 + rand() * 0.5,
      twinkle: rand() * Math.PI * 2,
    }));

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
    }

    let raf = 0;
    let running = false;
    let onScreen = true;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";

      const cx = w / 2;
      const cy = h / 2;

      for (const p of particles) {
        p.z -= p.speed * dt;
        if (p.z < NEAR) {
          p.z = FAR;
          p.x = rand() * 2 - 1;
          p.y = rand() * 2 - 1;
        }
        p.twinkle += dt * 2;

        // Perspective divide: closer particles project further out and larger.
        const k = 1 / p.z;
        const sx = cx + p.x * cx * k * 1.6;
        const sy = cy + p.y * cy * k * 1.6;
        if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;

        const depth = 1 - (p.z - NEAR) / (FAR - NEAR); // 1 near, 0 far
        const size = 4 + depth * 46;
        const alpha = (0.12 + depth * 0.7) * (0.75 + Math.sin(p.twinkle) * 0.25);

        ctx!.globalAlpha = Math.min(1, alpha);
        ctx!.drawImage(depth > 0.55 ? spriteAccent : sprite, sx - size / 2, sy - size / 2, size, size);
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
      if (running) raf = requestAnimationFrame(frame);
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
