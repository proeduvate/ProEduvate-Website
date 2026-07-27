import { BrainCircuit, Users, Gem, Sparkles, LayoutGrid, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { reasons } from "@/data/why-choose-us";

const iconMap: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  users: Users,
  gem: Gem,
  sparkles: Sparkles,
  "layout-grid": LayoutGrid,
};

export function WhyChooseUs() {
  return (
    <section className="bg-surface-2 py-24 md:py-32">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Why ProEduvate"
          title="Why choose us."
          description="A few reasons clients keep coming back to build with us."
        />

        <div className="mt-16 border-t border-white/10 md:mt-20">
          {reasons.map((reason, i) => {
            const Icon = iconMap[reason.icon];
            return (
              <AnimatedReveal key={reason.title} delay={i * 0.05}>
                <div className="group grid grid-cols-1 items-baseline gap-4 border-b border-white/10 py-9 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[3rem_1fr_1.1fr] md:gap-10 md:py-12">
                  <span className="label-micro text-gray-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="flex items-center gap-4 font-display text-2xl font-normal tracking-tight text-chalk sm:text-3xl">
                    <Icon
                      className="h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    />
                    {reason.title}
                  </h3>

                  <p className="text-base leading-relaxed text-gray-400">{reason.description}</p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
