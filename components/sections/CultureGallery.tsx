"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { usePointerTilt } from "@/lib/usePointerTilt";

// STUB: gradient placeholder blocks stand in for real team/office
// photography, per the project brief (no stock photos used). Replace each
// block with a real <Image /> once photography is available.
const snapshots = [
  { label: "Team offsite", gradient: "from-primary via-primary-2 to-accent" },
  { label: "Deep work day", gradient: "from-black via-primary to-primary-2" },
  { label: "Product launch day", gradient: "from-accent via-primary-2 to-black" },
  { label: "Weekly demo Friday", gradient: "from-primary-2 via-accent to-accent-glow" },
];

/*
 * Culture snapshots fanned across a tilting 3D stage. The plates alternate
 * depth so the row reads as a shelf receding from the viewer rather than a
 * flat strip of tiles.
 */
export function CultureGallery() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({ max: 8, maxX: 5 });

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="07"
          eyebrow="Culture"
          title="A glimpse at how we work."
          align="center"
        />
      </Container>

      <div ref={tiltRef} className="relative mt-14" style={{ perspective: "1300px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <ul
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              {snapshots.map((snapshot, i) => {
                // Alternate forward/back so the row zig-zags in depth.
                const depth = i % 2 === 0 ? 40 : -70;
                return (
                  <motion.li
                    key={snapshot.label}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 32, z: depth }
                    }
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z: depth }
                    }
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className={`relative flex aspect-[3/4] items-end overflow-hidden border border-white/10 bg-gradient-to-br p-5 ${snapshot.gradient}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                      />
                      <p className="label-micro relative text-white/90">{snapshot.label}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </Container>
        </motion.div>
      </div>

      <Container className="relative mt-14 text-center">
        <Button href="/careers" size="lg">
          See Open Roles
        </Button>
      </Container>
    </section>
  );
}
