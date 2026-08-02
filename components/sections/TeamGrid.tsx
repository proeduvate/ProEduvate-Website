"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { team } from "@/data/team";

/*
 * Leadership as depth-staggered cards on a tilting stage.
 *
 * NOTE: `data/team.ts` is still placeholder content -- invented names, roles
 * and bios. The section is deliberately labelled as provisional rather than
 * quietly presented as real, because a fabricated leadership page is worse
 * than an obviously unfinished one. Swap the data and drop the notice
 * together.
 */
export function TeamGrid() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({ max: 5, maxX: 3 });

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="06"
          eyebrow="Leadership"
          title="The people steering ProEduvate."
        />
        <p className="label-micro mt-6 inline-flex border border-white/15 px-3 py-2 text-gray-500">
          Placeholder profiles — real names and bios pending
        </p>
      </Container>

      <div ref={tiltRef} className="relative mt-14" style={{ perspective: "1600px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <ul
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              {team.map((member, i) => {
                // Rows recede: the further down the grid, the further back.
                const depth = -Math.floor(i / 3) * 55;
                return (
                  <motion.li
                    key={member.name}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 30, z: depth }
                    }
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z: depth }
                    }
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{
                      duration: 0.55,
                      delay: (i % 3) * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group h-full border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-display text-lg text-accent">
                        {member.initials}
                      </span>
                      <span className="label-micro text-gray-600 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl font-normal text-chalk">
                      {member.name}
                    </h3>
                    <p className="label-micro mt-2 text-accent">{member.role}</p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400">{member.bio}</p>

                    <a
                      href={member.linkedin}
                      aria-label={`${member.name} on LinkedIn`}
                      className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-colors hover:border-accent hover:text-accent"
                    >
                      <LinkedInIcon className="h-4 w-4" />
                    </a>
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
