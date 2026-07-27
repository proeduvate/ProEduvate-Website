import { BrainCircuit, Users, Gem, Sparkles, LayoutGrid, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
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
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Why ProEduvate"
          title="Why choose us."
          description="A few reasons clients keep coming back to build with us."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = iconMap[reason.icon];
            return (
              <AnimatedReveal key={reason.title} className="h-full">
                <Card className="h-full">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-medium text-black">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {reason.description}
                  </p>
                </Card>
              </AnimatedReveal>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
