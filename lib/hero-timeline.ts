/**
 * Single source of truth for the hero's scroll-progress phase boundaries
 * (0 = top of the pinned section, 1 = pin release). Shared between
 * Hero.tsx (text beats) and HeroScene.tsx (3D choreography) so the two
 * can't drift out of sync when either is tuned.
 *
 * Sequence: devices (laptop + phone) sit on screen and idle, then slide
 * away as the logo flies in like a paper plane and lands facing the
 * camera, then reorients to a top-down view, rolls, and exits — handing
 * off to the next section.
 */
export const HERO_TIMELINE = {
  devicesHoldEnd: 0.14,
  // Phone leads, laptop follows a beat behind — staggered within the same
  // overall exit window rather than moving in lockstep.
  phoneExitStart: 0.14,
  phoneExitEnd: 0.26,
  laptopExitStart: 0.18,
  laptopExitEnd: 0.3,
  devicesExitEnd: 0.3,
  flightStart: 0.26,
  flightEnd: 0.5,
  landHoldEnd: 0.58,
  topTransitionEnd: 0.72,
  rollEnd: 0.87,
  exitEnd: 1.0,
} as const;

export const TEXT_BEATS = {
  beat1FadeStart: 0.12,
  beat1FadeEnd: 0.2,
  beat2FadeInStart: 0.46,
  beat2FadeInEnd: 0.54,
  beat2FadeOutStart: 0.8,
  beat2FadeOutEnd: 0.87,
  beat3FadeInStart: 0.85,
  beat3FadeInEnd: 0.94,
} as const;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
