"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { cn } from "@/lib/utils";
import { internTrack, type CoreDiscipline, type OrgSeat } from "@/data/org-chart";

/*
 * The reporting structure as an org chart on a tilted 3D plane.
 *
 * The whole chart is one plane rotated back on X, with each card popped
 * toward the viewer on Z. Keeping the connectors coplanar with the cards is
 * the reason for that arrangement: a line joining two boxes at different Z
 * depths would need real 3D geometry, and faking it with a 2D rule leaves
 * visible gaps at the joins. Tilting the plane gives the depth instead.
 */

const CARD = "border bg-surface-2 transition-colors duration-300";
// Shared width for the chiefs row and the connectors above and below it, so
// the branch/merge rules stay anchored to the two column centres.
const CHIEF_ROW = "w-full max-w-3xl";

function Seat({
  abbr,
  title,
  holder,
  accent = false,
  z = 0,
  delay = 0,
}: {
  abbr: string;
  title: string;
  holder: string | null;
  accent?: boolean;
  z?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: `translateZ(${z}px)` }}
      className={cn(
        CARD,
        "w-[210px] px-5 py-4 text-center sm:w-[240px]",
        accent
          ? "border-accent/60 shadow-[0_0_36px_-12px_var(--color-accent)]"
          : "border-white/12"
      )}
    >
      <p className={cn("font-display text-lg", accent ? "text-accent" : "text-chalk")}>{abbr}</p>
      <p className="label-micro mt-1.5 text-gray-500">{title}</p>
      <p className="mt-2 text-xs text-gray-600">{holder ?? "Seat unfilled"}</p>
    </motion.div>
  );
}

/** Vertical rule between tiers. */
function Drop({ height = 34 }: { height?: number }) {
  return (
    <span
      aria-hidden="true"
      className="w-px shrink-0 bg-gradient-to-b from-accent/70 to-accent/25"
      style={{ height }}
    />
  );
}

export function OrgChart({
  spine: orgSpine,
  branch: orgBranch,
  coreTeam,
}: {
  spine: OrgSeat[];
  branch: OrgSeat[];
  coreTeam: CoreDiscipline[];
}) {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({
    max: 7,
    maxX: 4,
  });

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <SectionHeading
          index="06"
          eyebrow="Leadership"
          title="The people steering ProEduvate."
          description="How the company reports, from the top through to the interns shipping alongside each pod."
          align="center"
        />
        <p className="label-micro mx-auto mt-6 w-fit border border-white/15 px-3 py-2 text-gray-500">
          Seats are real — names pending
        </p>
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "2400px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          {/* The chart plane, tilted back so it recedes from the viewer. */}
          <div
            className="overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={
              shouldReduceMotion
                ? undefined
                : { transform: "rotateX(11deg)", transformStyle: "preserve-3d" }
            }
          >
            <div className="mx-auto flex w-full min-w-[640px] max-w-6xl flex-col items-center px-6 lg:px-10">
              {/* Spine: CEO -> Manager -> COO */}
              {orgSpine.map((seat, i) => (
                <div key={seat.abbr} className="flex flex-col items-center">
                  <Seat
                    {...seat}
                    accent={i === 0}
                    z={70 - i * 14}
                    delay={i * 0.07}
                  />
                  <Drop />
                </div>
              ))}

              {/* Split to the two chiefs. The chiefs sit in a two-column grid
                  so the connector's 25%/75% anchors land exactly on the
                  column centres -- with a gap-based flex row they would drift
                  with the card width. */}
              <Branch />

              <div className={cn(CHIEF_ROW, "grid grid-cols-2 justify-items-center")}>
                {orgBranch.map((seat, i) => (
                  <div key={seat.abbr} className="flex flex-col items-center">
                    <Seat {...seat} z={28} delay={0.24 + i * 0.07} />
                    <Drop height={30} />
                  </div>
                ))}
              </div>

              {/* Both chiefs merge into one core team */}
              <Merge />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transform: "translateZ(6px)" }}
                className="w-full border border-white/12 bg-white/[0.03] p-6"
              >
                <p className="label-micro mb-5 text-center text-accent">
                  Core Team · one pod per discipline
                </p>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
                  {coreTeam.map((pod, i) => (
                    <motion.li
                      key={pod.discipline}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-4%" }}
                      transition={{ duration: 0.45, delay: i * 0.05 }}
                      className="flex flex-col border border-white/10 bg-surface-2/70 p-4 transition-colors duration-300 hover:border-accent/50 lg:p-5"
                    >
                      <span className="label-micro text-gray-600 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 font-display text-sm leading-snug text-chalk">
                        {pod.discipline}
                      </p>
                      <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                        {pod.stack.join(" · ")}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <Drop height={30} />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-4%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transform: "translateZ(-26px)" }}
                className="w-full border border-dashed border-white/15 bg-white/[0.02] px-6 py-5 text-center"
              >
                <p className="label-micro text-accent">{internTrack.label}</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                  {internTrack.description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One line down, a horizontal bar, then two lines down to the chiefs. */
function Branch() {
  return (
    <div aria-hidden="true" className={cn(CHIEF_ROW, "relative h-10")}>
      <span className="absolute top-0 left-1/2 h-5 w-px -translate-x-1/2 bg-accent/50" />
      <span className="absolute top-5 right-1/4 left-1/4 h-px bg-accent/40" />
      <span className="absolute top-5 left-1/4 h-5 w-px bg-accent/40" />
      <span className="absolute top-5 right-1/4 h-5 w-px bg-accent/40" />
    </div>
  );
}

/** Two lines converging back into one. */
function Merge() {
  return (
    <div aria-hidden="true" className={cn(CHIEF_ROW, "relative h-10")}>
      <span className="absolute top-0 right-1/4 left-1/4 h-px bg-accent/40" />
      <span className="absolute top-0 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 to-accent/70" />
    </div>
  );
}
