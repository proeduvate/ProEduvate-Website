/*
 * Turns public/brand/ceo.jpeg into a transparent-background PNG.
 *
 *   node scripts/cutout-ceo.mjs
 *
 * The source is already a cutout composited onto pure black -- the
 * background measures exactly 0.0 luminance and ~938k pixels sit in the
 * 0-2 bin, with a sharp drop after. So this is a keying job, not a
 * segmentation one, and no model is needed.
 *
 * A plain luminance threshold is not enough: parts of the navy suit also
 * measure near zero, and thresholding alone punches holes through them. The
 * fill instead starts from the border and only clears black that is
 * *connected to the edge*, which leaves interior shadow intact.
 *
 * The alpha is then feathered by a sub-pixel blur so the cut edge does not
 * alias against the dark section behind it, and the result is cropped to the
 * subject so the portrait is not mostly empty margin.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "brand", "ceo.jpeg");
const OUT = path.join(process.cwd(), "public", "team", "ceo.png");

/** Luminance at or below this counts as background, if edge-connected. */
const KEY_THRESHOLD = 10;
/** Pixels this far above the threshold ramp from transparent to opaque. */
const SOFT_RANGE = 18;
const PAD = 12;

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;

const lumAt = (i) => 0.2126 * data[i * c] + 0.7152 * data[i * c + 1] + 0.0722 * data[i * c + 2];

// --- flood fill the background from every border pixel --------------------
const isBackground = new Uint8Array(w * h);
const stack = [];

for (let x = 0; x < w; x++) {
  stack.push(x, x + (h - 1) * w);
}
for (let y = 0; y < h; y++) {
  stack.push(y * w, w - 1 + y * w);
}

while (stack.length) {
  const idx = stack.pop();
  if (isBackground[idx]) continue;
  if (lumAt(idx) > KEY_THRESHOLD) continue;
  isBackground[idx] = 1;

  const x = idx % w;
  const y = (idx / w) | 0;
  if (x > 0) stack.push(idx - 1);
  if (x < w - 1) stack.push(idx + 1);
  if (y > 0) stack.push(idx - w);
  if (y < h - 1) stack.push(idx + w);
}

// --- alpha, with a soft ramp just above the key so edges aren't binary ----
const alpha = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) {
  if (isBackground[i]) {
    alpha[i] = 0;
    continue;
  }
  const l = lumAt(i);
  alpha[i] =
    l >= KEY_THRESHOLD + SOFT_RANGE
      ? 255
      : Math.round(((l - KEY_THRESHOLD) / SOFT_RANGE) * 255);
}

// `toColourspace("b-w")` is not optional: sharp promotes a single-channel raw
// input back to 3 channels on output, and the resulting interleaved buffer
// silently shifts every index in the bounding-box pass below.
const feathered = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
  .blur(0.8)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

if (feathered.length !== w * h) {
  throw new Error(`alpha buffer is ${feathered.length}, expected ${w * h}`);
}

// --- crop to the subject --------------------------------------------------
let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
for (let i = 0; i < w * h; i++) {
  if (feathered[i] < 24) continue;
  const x = i % w;
  const y = (i / w) | 0;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
const left = Math.max(0, minX - PAD);
const top = Math.max(0, minY - PAD);
const cropW = Math.min(w - left, maxX - minX + PAD * 2);
const cropH = Math.min(h - top, maxY - minY + PAD * 2);

const rgb = await sharp(SRC).removeAlpha().raw().toBuffer();

// Compose and crop in two passes. Chained after `joinChannel`, `extract` is
// applied against the input rather than the composed image and silently
// leaves the full frame in place.
const composed = await sharp(rgb, { raw: { width: w, height: h, channels: 3 } })
  .joinChannel(feathered, { raw: { width: w, height: h, channels: 1 } })
  .png()
  .toBuffer();

const png = await sharp(composed)
  .extract({ left, top, width: cropW, height: cropH })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(OUT, png);

const finalMeta = await sharp(png).metadata();
if (finalMeta.width !== cropW || finalMeta.height !== cropH) {
  throw new Error(`crop did not apply: got ${finalMeta.width}x${finalMeta.height}`);
}

const cleared = isBackground.reduce((n, v) => n + v, 0);
console.log(`source        ${w}x${h}`);
console.log(`cleared       ${cleared} px (${((cleared / (w * h)) * 100).toFixed(1)}% background)`);
console.log(`cropped to    ${cropW}x${cropH} at ${left},${top}`);
console.log(`written       public/team/ceo.png  ${(png.length / 1024).toFixed(0)} KB`);
