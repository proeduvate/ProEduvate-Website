"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

function frameUrl(basePath: string, index: number, extension: string) {
  return `${basePath}/frame_${String(index).padStart(3, "0")}.${extension}`;
}

/** `object-fit: cover` math for drawing a source image into a differently-shaped canvas. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (imgRatio > canvasRatio) {
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
}

/**
 * Plays a pre-rendered image sequence (baked from HeroScene.tsx via the
 * app/dev/hero-capture rig) by drawing the frame matching the current
 * scroll progress into a 2D canvas, "Apple product page" style. Chosen over
 * a scrubbed <video> element because seek precision/latency across browsers
 * (notably Safari) isn't reliable enough for frame-accurate scroll sync.
 *
 * All frames are eagerly preloaded — there are ~100 small WebP images, and
 * this sits above the fold, so there's no lazy-loading benefit worth the
 * complexity of a windowed loading strategy.
 */
export function ScrollFrameSequence({
  scrollProgress,
  frameCount,
  basePath,
  extension = "webp",
}: {
  scrollProgress: MotionValue<number>;
  frameCount: number;
  basePath: string;
  extension?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(frameCount);
    let currentIndex = 0;

    function draw(index: number) {
      const img = images[index];
      if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (width === 0 || height === 0) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      drawCover(ctx, img, width, height);
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(basePath, i, extension);
      img.onload = () => {
        if (i === currentIndex) draw(i);
      };
      images[i] = img;
    }

    const update = () => {
      const progress = scrollProgress.get();
      currentIndex = Math.min(frameCount - 1, Math.max(0, Math.round(progress * (frameCount - 1))));
      draw(currentIndex);
    };

    update();
    const unsubscribe = scrollProgress.on("change", update);
    window.addEventListener("resize", update);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", update);
    };
  }, [scrollProgress, frameCount, basePath, extension]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
