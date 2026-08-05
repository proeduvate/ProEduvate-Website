"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParticleDepthField } from "@/components/ui/ParticleDepthField";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { domains } from "@/data/domains";

/*
 * Capabilities over a depth particle field, with each chip glowing on its own
 * plane.
 *
 * The chips are staggered in Z so they sit at different distances inside the
 * particle volume rather than floating on one sheet in front of it.
 */
export function DomainsGrid() {
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 8, maxX: 5 });

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#04060a] py-24 md:py-32">
      <ParticleDepthField className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Core glow behind the chips */}
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora] pointer-events-none absolute top-1/2 left-1/2 h-[65vh] w-[65vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[120px]"
        style={{ background: "var(--color-accent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, transparent 25%, #04060a 85%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          index="02"
          eyebrow="Our Capabilities"
          title="Domains we work on."
          description="The technical disciplines behind every product and client engagement we ship."
          align="center"
        />
      </Container>

      <div ref={tiltRef} className="relative mt-14" style={{ perspective: "2400px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <ul
              className="flex flex-wrap justify-center gap-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              {domains.map((domain, i) => {
                // Alternating depth so the chips occupy the particle volume
                // instead of sitting on a single plane in front of it.
                const z = ((i % 3) - 1) * 55;
                return (
                  <motion.li
                    key={domain}
                    initial={{ opacity: 0, y: 18, z: z - 60 }}
                    whileInView={{ opacity: 1, y: 0, z }}
                    viewport={{ once: true, margin: "-6%" }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className="group relative inline-flex items-center rounded-full border border-accent/30 bg-[#0d1420] px-6 py-3 text-sm text-gray-200 transition-all duration-300 hover:border-accent hover:text-white"
                      style={{ boxShadow: "0 0 30px -10px var(--color-accent)" }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"
                        style={{ background: "var(--color-accent)" }}
                      />
                      <span className="relative">{domain}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
