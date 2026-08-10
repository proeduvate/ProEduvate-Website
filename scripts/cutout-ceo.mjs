/*
 * Prepares the CEO portrait for the site.
 *
 *   node scripts/cutout-ceo.mjs [source]
 *
 * Writes public/team/ceo.png -- a transparent cut-out cropped to the subject,
 * which is what CeoSpotlight composites straight onto the section with no
 * frame behind it.
 *
 * Handles both kinds of source:
 *
 *   * **Already has alpha** (an exported cut-out). Only the crop runs.
 *   * **No alpha, subject on black.** The background is keyed out first.
 *     A plain luminance threshold is not enough -- parts of a navy suit also
 *     measure near zero and get punched through -- so the fill starts at the
 *     border and clears only black that is *connected to the edge*, leaving
 *     interior shadow intact.
 *
 * The crop matters: a supplied export is usually padded, and the section
 * sizes the image by its container, so empty margin shrinks the subject.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), process.argv[2] ?? "public/team/ceo-new.png");
const OUT = path.join(process.cwd(), "public", "team", "ceo.png");

/** Luminance at or below this counts as background, if edge-connected. */
const KEY_THRESHOLD = 10;
/** Pixels this far above the threshold ramp from transparent to opaque. */
const SOFT_RANGE = 18;
/** Alpha below this is treated as empty when measuring the subject. */
const EMPTY_ALPHA = 24;
const PAD = 12;

const meta = await sharp(SRC).metadata();
const { width: w, height: h } = meta;

let alpha;

if (meta.hasAlpha) {
  // `toColourspace("b-w")` is not optional: sharp otherwise promotes a
  // single-channel result back to 3 interleaved channels, which silently
  // shifts every index in the bounding-box pass below.
  alpha = await sharp(SRC).extractChannel("alpha").toColourspace("b-w").raw().toBuffer();
  console.log("source has alpha — keying skipped");
} else {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const c = info.channels;
  const lumAt = (i) =>
    0.2126 * data[i * c] + 0.7152 * data[i * c + 1] + 0.0722 * data[i * c + 2];

  const isBackground = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, x + (h - 1) * w);
  for (let y = 0; y < h; y++) stack.push(y * w, w - 1 + y * w);

  while (stack.length) {
    const idx = stack.pop();
    if (isBackground[idx] || lumAt(idx) > KEY_THRESHOLD) continue;
    isBackground[idx] = 1;
    const x = idx % w;
    const y = (idx / w) | 0;
    if (x > 0) stack.push(idx - 1);
    if (x < w - 1) stack.push(idx + 1);
    if (y > 0) stack.push(idx - w);
    if (y < h - 1) stack.push(idx + w);
  }

  const keyed = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    if (isBackground[i]) continue;
    const l = lumAt(i);
    keyed[i] =
      l >= KEY_THRESHOLD + SOFT_RANGE
        ? 255
        : Math.round(((l - KEY_THRESHOLD) / SOFT_RANGE) * 255);
  }

  alpha = await sharp(keyed, { raw: { width: w, height: h, channels: 1 } })
    .blur(0.8)
    .toColourspace("b-w")
    .raw()
    .toBuffer();

  const cleared = isBackground.reduce((n, v) => n + v, 0);
  console.log(`keyed out ${cleared} px (${((cleared / (w * h)) * 100).toFixed(1)}% background)`);
}

if (alpha.length !== w * h) {
  throw new Error(`alpha buffer is ${alpha.length}, expected ${w * h}`);
}

// --- crop to the subject --------------------------------------------------
let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
for (let i = 0; i < w * h; i++) {
  if (alpha[i] < EMPTY_ALPHA) continue;
  const x = i % w;
  const y = (i / w) | 0;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
const left = Math.max(0, minX - PAD);
const top = Math.max(0, minY - PAD);
const cropW = Math.min(w - left, maxX - minX + 1 + PAD * 2);
const cropH = Math.min(h - top, maxY - minY + 1 + PAD * 2);

const rgb = await sharp(SRC).removeAlpha().raw().toBuffer();

// Compose and crop in two passes. Chained after `joinChannel`, `extract`
// applies to the input rather than the composed image and leaves the full
// frame in place.
const composed = await sharp(rgb, { raw: { width: w, height: h, channels: 3 } })
  .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
  .png()
  .toBuffer();

const png = await sharp(composed)
  .extract({ left, top, width: cropW, height: cropH })
  .png({ compressionLevel: 9 })
  .toBuffer();

const final = await sharp(png).metadata();
if (final.width !== cropW || final.height !== cropH) {
  throw new Error(`crop did not apply: got ${final.width}x${final.height}`);
}

await writeFile(OUT, png);

console.log(`source     ${path.relative(process.cwd(), SRC)}  ${w}x${h}`);
console.log(`cropped to ${cropW}x${cropH} at ${left},${top}`);
console.log(`written    public/team/ceo.png  ${(png.length / 1024).toFixed(0)} KB`);
