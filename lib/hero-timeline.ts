/**
 * Single source of truth for the hero's scroll-progress phase boundaries
 * (0 = top of the pinned section, 1 = pin release). Shared between
 * Hero.tsx (text beats) and HeroScene.tsx (the 3D choreography) so the two
 * can't drift out of sync when either is tuned.
 *
 * Sequence: the laptop + phone sit on the left, idle, then float upward
 * with light streaming down beneath them. The camera then rushes forward
 * through a field of light streaks converging on a point where the logo
 * emerges, growing as it flies toward the viewer. It banks into frame,
 * settles into a top-down view with rings rippling out beneath it on the
 * ground, then flies off and exits toward the top-right corner.
 */
export const HERO_TIMELINE = {
  holdEnd: 0.16,
  ascendEnd: 0.32,
  warpEnd: 0.54,
  arriveEnd: 0.64,
  settleEnd: 0.8,
  exitEnd: 1.0,
} as const;

export const TEXT_BEATS = {
  headlineFadeStart: 0.14,
  headlineFadeEnd: 0.28,
  statementFadeInStart: 0.56,
  statementFadeInEnd: 0.64,
  statementFadeOutStart: 0.78,
  statementFadeOutEnd: 0.85,
  ctaFadeStart: 0.86,
  ctaFadeEnd: 0.96,
} as const;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
