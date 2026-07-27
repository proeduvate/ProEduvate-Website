// Regenerates the compressed hero frame sequence from the source PNGs.
//
// Usage:
//   node scripts/build-hero-frames.mjs
//
// Source frames: animation_frames/0001.{png,jpg,jpeg} .. NNNN.{png,jpg,jpeg}
// (any zero-padded length; extension can be mixed across frames)
// Output: public/hero-frames/desktop (full sequence, native width, lossless) and
//         public/hero-frames/mobile (downsampled to half the frames, 960w, lossy)
//
// Desktop is lossless WebP at native resolution by request -- this is a large
// payload (~170MB for 240 1080p frames) and holds ~1.9GB of decoded raster in
// memory at once. Drop DESKTOP_LOSSLESS to false and set a DESKTOP_QUALITY to
// go back to lossy compression if load times become a problem.
//
// If you change the total frame count, update DESKTOP_FRAME_COUNT /
// MOBILE_FRAME_COUNT in components/sections/Hero.tsx to match.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SRC_DIR = path.join(ROOT, "animation_frames");
const DESKTOP_OUT = path.join(ROOT, "public/hero-frames/desktop");
const MOBILE_OUT = path.join(ROOT, "public/hero-frames/mobile");

const DESKTOP_WIDTH = null; // null = keep native source resolution
const DESKTOP_LOSSLESS = true;
const DESKTOP_QUALITY = 95; // only used when DESKTOP_LOSSLESS is false
const MOBILE_WIDTH = 960;
const MOBILE_QUALITY = 68;
const MOBILE_FRAME_RATIO = 0.5; // half the desktop frame count

function pad(n, width) {
  return String(n).padStart(width, "0");
}

async function runPool(items, concurrency, worker) {
  let i = 0;
  const runners = new Array(concurrency).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
}

function main() {
  const sourceFiles = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /^\d+\.(png|jpe?g)$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  if (sourceFiles.length === 0) {
    console.error(`No numbered PNG/JPEG frames found in ${SRC_DIR}`);
    process.exit(1);
  }

  const total = sourceFiles.length;
  const padWidth = sourceFiles[0].replace(/\.(png|jpe?g)$/i, "").length;
  const mobileTotal = Math.max(1, Math.round(total * MOBILE_FRAME_RATIO));

  console.log(`Found ${total} source frames in ${SRC_DIR}`);
  fs.mkdirSync(DESKTOP_OUT, { recursive: true });
  fs.mkdirSync(MOBILE_OUT, { recursive: true });

  return { sourceFiles, total, padWidth, mobileTotal };
}

async function build() {
  const { sourceFiles, total, padWidth, mobileTotal } = main();

  let doneDesktop = 0;
  await runPool(sourceFiles, 4, async (file, idx) => {
    const src = path.join(SRC_DIR, file);
    const out = path.join(DESKTOP_OUT, `frame_${pad(idx + 1, 4)}.webp`);
    let pipeline = sharp(src);
    if (DESKTOP_WIDTH) pipeline = pipeline.resize({ width: DESKTOP_WIDTH });
    pipeline = DESKTOP_LOSSLESS
      ? pipeline.webp({ lossless: true })
      : pipeline.webp({ quality: DESKTOP_QUALITY });
    await pipeline.toFile(out);
    doneDesktop++;
    if (doneDesktop % 40 === 0 || doneDesktop === total) {
      console.log(`desktop: ${doneDesktop}/${total}`);
    }
  });

  let doneMobile = 0;
  const mobileJobs = Array.from({ length: mobileTotal }, (_, m) => {
    const srcIdx = Math.min(total, Math.round(((m + 1) / mobileTotal) * total));
    return { m, file: sourceFiles[srcIdx - 1] };
  });
  await runPool(mobileJobs, 8, async ({ m, file }) => {
    const src = path.join(SRC_DIR, file);
    const out = path.join(MOBILE_OUT, `frame_${pad(m + 1, 4)}.webp`);
    await sharp(src).resize({ width: MOBILE_WIDTH }).webp({ quality: MOBILE_QUALITY }).toFile(out);
    doneMobile++;
    if (doneMobile % 20 === 0 || doneMobile === mobileTotal) {
      console.log(`mobile: ${doneMobile}/${mobileTotal}`);
    }
  });

  const sizeOf = (dir) =>
    fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);

  console.log(`\nDone.`);
  console.log(`Desktop: ${total} frames, ${(sizeOf(DESKTOP_OUT) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Mobile:  ${mobileTotal} frames, ${(sizeOf(MOBILE_OUT) / 1024 / 1024).toFixed(2)} MB`);

  const padWidthNote = padWidth !== 4 ? ` (source used ${padWidth}-digit names; output is always 4-digit)` : "";
  console.log(`\nIf the frame count changed, update DESKTOP_FRAME_COUNT (${total}) and`);
  console.log(`MOBILE_FRAME_COUNT (${mobileTotal}) in components/sections/Hero.tsx.${padWidthNote}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
