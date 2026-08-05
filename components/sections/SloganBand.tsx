"use client";

import { Container } from "@/components/ui/Container";
import { FloatingCubes } from "@/components/ui/FloatingCubes";
import { SloganTriad } from "@/components/ui/SloganTriad";

/*
 * The company slogan as a section of its own.
 *
 * Deliberately standalone rather than tucked into the hero or the stats
 * band: three words carrying the whole company positioning need the silence
 * around them to land, and sharing a section with anything else turns them
 * into a caption for it.
 *
 * Centred, on its own dark ground, with an accent glow behind and nothing
 * else competing.
 */
export function SloganBand() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-surface py-20 md:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      {/* Cubes sit above the grid but under the glow, so the glow reads as
          light in front of them rather than a wash over everything. */}
      <FloatingCubes />

      <div
        aria-hidden="true"
        className="animate-[--animate-aurora-slow] pointer-events-none absolute top-1/2 left-1/2 h-[50vh] w-[80vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <p className="label-micro mb-8 flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
            What we build on
            <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
          </p>

          {/* `justify-center` reaches the triad's own flex row through the
              wrapper, so the three words centre as a group. */}
          <SloganTriad className="[&_ul]:justify-center" />
        </div>
      </Container>
    </section>
  );
}
