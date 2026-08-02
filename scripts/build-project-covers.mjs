/*
 * Generates cover art for the custom-project tiles.
 *
 * These are PLACEHOLDER covers -- procedurally drawn, not screenshots of the
 * real deliverables. They exist so the hover popup has genuine image assets
 * to show rather than an icon, and so each tile is visually distinguishable.
 * Replace them with real screenshots when those are available; the filenames
 * are derived from the project slug, so dropping a real image in at the same
 * path is all it takes.
 *
 *   node scripts/build-project-covers.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "custom-projects");
const W = 960;
const H = 720;

const SURFACE = "#06080c";
const ACCENT = "#0082fb";

/** Deterministic pseudo-random so reruns produce identical files. */
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const projects = [
  { slug: "ai-seva", motif: "nodes", hue: 0 },
  { slug: "blood-detection", motif: "wave", hue: 340 },
  { slug: "nexus-company-website", motif: "grid", hue: 160 },
  { slug: "hospital-website", motif: "arcs", hue: 190 },
  { slug: "crm", motif: "bars", hue: 40 },
  { slug: "ai-tender-summarizer", motif: "lines", hue: 265 },
  { slug: "certificate-management-portal", motif: "grid", hue: 55 },
  { slug: "recruitment-chatbot", motif: "nodes", hue: 210 },
  { slug: "appointment-booking-chatbot", motif: "arcs", hue: 285 },
  { slug: "social-media-app", motif: "wave", hue: 320 },
  { slug: "lead-generator", motif: "bars", hue: 130 },
];

function tint(hue) {
  // Keep everything in the same family as the brand accent, rotated in hue.
  return `hsl(${(210 + hue) % 360} 92% 52%)`;
}

function motifMarkup(motif, seed, colour) {
  const rand = rng(seed);
  const parts = [];

  if (motif === "nodes") {
    const pts = Array.from({ length: 14 }, () => ({
      x: 80 + rand() * (W - 160),
      y: 80 + rand() * (H - 160),
    }));
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 250) {
          parts.push(
            `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}" stroke="${colour}" stroke-opacity="0.28" stroke-width="1"/>`
          );
        }
      }
    }
    for (const p of pts) {
      parts.push(
        `<circle cx="${p.x}" cy="${p.y}" r="${3 + rand() * 5}" fill="${colour}" fill-opacity="0.85"/>`
      );
    }
  }

  if (motif === "wave") {
    for (let k = 0; k < 6; k++) {
      const amp = 40 + k * 14;
      const yBase = H / 2 + (k - 3) * 34;
      let d = `M 0 ${yBase}`;
      for (let x = 0; x <= W; x += 24) {
        d += ` Q ${x + 12} ${yBase + Math.sin((x / W) * Math.PI * 3 + k) * amp} ${x + 24} ${yBase}`;
      }
      parts.push(
        `<path d="${d}" fill="none" stroke="${colour}" stroke-opacity="${0.5 - k * 0.06}" stroke-width="1.5"/>`
      );
    }
  }

  if (motif === "grid") {
    for (let x = 0; x < W; x += 60) {
      for (let y = 0; y < H; y += 60) {
        const s = rand();
        if (s > 0.72) {
          parts.push(
            `<rect x="${x}" y="${y}" width="52" height="52" fill="${colour}" fill-opacity="${0.08 + s * 0.3}"/>`
          );
        } else {
          parts.push(
            `<rect x="${x}" y="${y}" width="52" height="52" fill="none" stroke="${colour}" stroke-opacity="0.16" stroke-width="1"/>`
          );
        }
      }
    }
  }

  if (motif === "arcs") {
    for (let k = 1; k <= 7; k++) {
      const r = k * 62;
      parts.push(
        `<circle cx="${W * 0.72}" cy="${H * 0.55}" r="${r}" fill="none" stroke="${colour}" stroke-opacity="${0.42 - k * 0.045}" stroke-width="1.5" stroke-dasharray="${18 + k * 6} ${10 + k * 3}"/>`
      );
    }
  }

  if (motif === "bars") {
    const n = 18;
    for (let i = 0; i < n; i++) {
      const h = 60 + rand() * (H * 0.62);
      parts.push(
        `<rect x="${40 + i * ((W - 80) / n)}" y="${H - 90 - h}" width="${(W - 80) / n - 12}" height="${h}" fill="${colour}" fill-opacity="${0.16 + rand() * 0.4}"/>`
      );
    }
  }

  if (motif === "lines") {
    for (let i = 0; i < 26; i++) {
      const y = 60 + i * 24;
      const w = 120 + rand() * (W - 300);
      parts.push(
        `<rect x="80" y="${y}" width="${w}" height="6" rx="3" fill="${colour}" fill-opacity="${0.12 + rand() * 0.35}"/>`
      );
    }
  }

  return parts.join("");
}

function svg({ motif, hue, seed }) {
  const colour = tint(hue);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="70%" cy="35%" r="75%">
      <stop offset="0%" stop-color="${colour}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${SURFACE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SURFACE}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${SURFACE}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${SURFACE}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g>${motifMarkup(motif, seed, colour)}</g>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${ACCENT}" stroke-opacity="0.18"/>
</svg>`;
}

await mkdir(OUT, { recursive: true });

for (const [i, project] of projects.entries()) {
  const markup = svg({ ...project, seed: i + 1 });
  const buffer = await sharp(Buffer.from(markup)).webp({ quality: 88 }).toBuffer();
  await writeFile(path.join(OUT, `${project.slug}.webp`), buffer);
  console.log(`${project.slug}.webp  ${(buffer.length / 1024).toFixed(0)} KB`);
}

console.log(`\n${projects.length} covers written to public/custom-projects/`);
