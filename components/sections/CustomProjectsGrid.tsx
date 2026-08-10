"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { CustomProject } from "@/data/custom-projects";

/*
 * Client work as tiles that raise a 3D preview card on hover.
 *
 * The popup renders inside the hovered tile rather than in a portal, so it
 * inherits the tile's stacking context. Its position is chosen per-tile
 * against the viewport (see `choosePlacement`) -- always opening upward
 * pushed the card off the top of the screen for tiles in the first row.
 *
 * Touch has no hover, so tapping a tile toggles its preview and pointer
 * events are filtered by `pointerType` -- without that filter a tap fires
 * both enter and click, and the card opens and closes in the same gesture.
 */

/** Popup footprint, in px. Fixed so placement can be decided before mount. */
const POPUP_W = 320;
// Measured at 396px with a three-line description; rounded up so a tile with
// just under the real height above it doesn't pick "above" and clip.
const POPUP_H = 410;
const GAP = 10;

/**
 * Picks the first position that actually fits in the viewport, preferring
 * above the tile and falling back to the sides before going below.
 *
 * Measured from the tile, not the popup: the popup does not exist yet at
 * decision time, so its footprint is fixed above and the choice is made up
 * front rather than flashing in the wrong place and correcting.
 *
 * Returns raw offsets rather than Tailwind translate classes. Framer Motion
 * owns the `transform` property while animating, so anything centred with
 * `-translate-x-1/2` would be overwritten on the first frame and the popup
 * would jump half its width sideways.
 */
function choosePlacement(rect: DOMRect): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centreX = { left: "50%", marginLeft: -POPUP_W / 2 };

  if (rect.top >= POPUP_H + GAP) {
    return { bottom: "100%", marginBottom: GAP, transformOrigin: "bottom center", ...centreX };
  }

  // Side placements anchor to whichever edge of the tile leaves room, so the
  // popup never runs off the bottom of the window.
  const vertical: React.CSSProperties =
    vh - rect.top >= POPUP_H + GAP ? { top: 0 } : { bottom: 0 };

  if (vw - rect.right >= POPUP_W + GAP) {
    return { left: "100%", marginLeft: GAP, transformOrigin: "left center", ...vertical };
  }
  if (rect.left >= POPUP_W + GAP) {
    return { right: "100%", marginRight: GAP, transformOrigin: "right center", ...vertical };
  }
  if (vh - rect.bottom >= POPUP_H + GAP) {
    return { top: "100%", marginTop: GAP, transformOrigin: "top center", ...centreX };
  }

  // Nothing fits cleanly. Above overlaps neighbouring tiles rather than
  // leaving the viewport, which is the least-bad outcome.
  return { bottom: "100%", marginBottom: GAP, transformOrigin: "bottom center", ...centreX };
}

export function CustomProjectsGrid({ customProjects }: { customProjects: CustomProject[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [placement, setPlacement] = useState<React.CSSProperties>({});
  const sectionRef = useRef<HTMLElement>(null);
  // Click events carry no pointerType, so it is captured on pointerdown and
  // read back in the click handler.
  const lastPointerType = useRef<string>("mouse");

  function open(index: number, el: HTMLElement) {
    setPlacement(choosePlacement(el.getBoundingClientRect()));
    setActive(index);
  }

  // Tapping outside an open preview dismisses it.
  useEffect(() => {
    if (active === null) return;
    function onDocPointerDown(e: PointerEvent) {
      if (!sectionRef.current?.contains(e.target as Node)) setActive(null);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-surface py-24 md:py-32"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="04"
          eyebrow="Client Work"
          title="Custom software we've built."
          description="A sample of the custom projects we've delivered for clients across industries. Hover a tile to preview it."
        />

        <ul
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1800px" }}
        >
          {customProjects.map((project, i) => {
            const isActive = active === i;
            return (
              <li
                key={project.slug}
                className="relative"
                style={{
                  transformStyle: "preserve-3d",
                  // `transform-style: preserve-3d` makes each tile its own
                  // stacking context, which traps the popup's z-index inside
                  // it -- later tiles in the grid then paint straight over the
                  // open card. Lifting the whole tile is what actually raises
                  // the popup above its siblings.
                  zIndex: isActive ? 40 : 1,
                }}
              >
                <button
                  type="button"
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "touch") open(i, e.currentTarget);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== "touch") setActive(null);
                  }}
                  onPointerDown={(e) => {
                    lastPointerType.current = e.pointerType;
                  }}
                  onClick={(e) => {
                    // Only touch toggles. With a mouse, pointerenter has
                    // already opened this tile, so a toggle here would close
                    // it again on the very same gesture.
                    if (lastPointerType.current === "touch") {
                      if (active === i) setActive(null);
                      else open(i, e.currentTarget);
                    } else {
                      open(i, e.currentTarget);
                    }
                  }}
                  onFocus={(e) => open(i, e.currentTarget)}
                  onBlur={() => setActive(null)}
                  aria-expanded={isActive}
                  aria-label={`${project.name}. ${project.description}`}
                  className={cn(
                    "flex h-full w-full flex-col items-start border p-5 text-left transition-all duration-300",
                    isActive
                      ? "border-accent/60 bg-accent/[0.06]"
                      : "border-white/10 bg-white/[0.03] hover:border-accent/40"
                  )}
                >
                  <div className="flex w-full items-center gap-3">
                    <span className="label-micro text-gray-600 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base text-chalk">{project.name}</span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {project.description}
                  </p>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      // Rises out of the tile toward the viewer, drops back on exit.
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 14, z: -60, rotateX: -12, scale: 0.94 }
                      }
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: -12, z: 90, rotateX: 0, scale: 1 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 8, z: -40, rotateX: -8, scale: 0.96 }
                      }
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute z-30 overflow-hidden border border-accent/50 bg-surface-2 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)]"
                      style={{ transformStyle: "preserve-3d", width: POPUP_W, ...placement }}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={project.image}
                          alt=""
                          fill
                          sizes={`${POPUP_W}px`}
                          className="object-cover"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-transparent"
                        />
                      </div>
                      <div className="p-5">
                        <p className="label-micro text-accent">Preview</p>
                        <p className="mt-2 font-display text-lg text-chalk">{project.name}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
                          {project.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <p className="label-micro mt-10 text-gray-600">
          Preview art is placeholder — real screenshots pending
        </p>
      </Container>
    </section>
  );
}
