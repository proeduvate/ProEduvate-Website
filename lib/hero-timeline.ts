/**
 * Single source of truth for the hero's scroll-progress phase boundaries
 * (0 = top of the pinned section, 1 = pin release). Shared between
 * Hero.tsx (text beats) and HeroScene.tsx (the laptop's turn/zoom/exit) so
 * the two can't drift out of sync when either is tuned.
 *
 * Sequence: the laptop sits on the right, angled toward the viewer, while
 * the headline holds on the left. On scroll it turns in place (vertical
 * axis only) to reveal the back of the lid, drifts toward the bottom-right
 * and fades out, while the camera dollies in throughout. The headline
 * fades out as the laptop turns away; the closing CTA fades in as it exits.
 */
export const TEXT_BEATS = {
  headlineFadeStart: 0.55,
  headlineFadeEnd: 0.72,
  ctaFadeStart: 0.82,
  ctaFadeEnd: 0.94,
} as const;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
