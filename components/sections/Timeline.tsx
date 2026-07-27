import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { timeline } from "@/data/timeline";

export function Timeline() {
  return (
    <section className="bg-surface-2 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Our Story" title="Milestones along the way." />

        <div className="mt-14 space-y-0">
          {timeline.map((milestone, i) => (
            <AnimatedReveal key={milestone.title} delay={i * 0.05}>
              <div className="grid grid-cols-[80px_1fr] gap-6 border-t border-white/10 py-8 first:border-t sm:grid-cols-[120px_1fr]">
                <span className="font-display text-2xl font-medium text-accent">
                  {milestone.year}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-chalk">{milestone.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
