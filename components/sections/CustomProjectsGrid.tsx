"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { customProjects } from "@/data/custom-projects";

/*
 * Client work as tiles that raise a 3D preview card on hover.
 *
 * The popup renders inside the hovered tile rather than in a portal, so it
 * inherits the tile's stacking context and needs no positioning maths.
 *
 * Touch has no hover, so tapping a tile toggles its preview and pointer
 * events are filtered by `pointerType` -- without that filter a tap fires
 * both enter and click, and the card opens and closes in the same gesture.
 */
export function CustomProjectsGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Click events carry no pointerType, so it is captured on pointerdown and
  // read back in the click handler.
  const lastPointerType = useRef<string>("mouse");

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
          style={{ perspective: "1200px" }}
        >
          {customProjects.map((project, i) => {
            const isActive = active === i;
            return (
              <li key={project.slug} className="relative" style={{ transformStyle: "preserve-3d" }}>
                <button
                  type="button"
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "touch") setActive(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== "touch") setActive(null);
                  }}
                  onPointerDown={(e) => {
                    lastPointerType.current = e.pointerType;
                  }}
                  onClick={() => {
                    // Only touch toggles. With a mouse, pointerenter has
                    // already opened this tile, so a toggle here would close
                    // it again on the very same gesture.
                    if (lastPointerType.current === "touch") {
                      setActive((prev) => (prev === i ? null : i));
                    } else {
                      setActive(i);
                    }
                  }}
                  onFocus={() => setActive(i)}
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
                      className="pointer-events-none absolute inset-x-0 bottom-full z-30 mb-2 origin-bottom overflow-hidden border border-accent/50 bg-surface-2 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={project.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
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
