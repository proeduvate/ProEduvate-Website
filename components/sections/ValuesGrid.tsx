import {
  Lightbulb,
  Gem,
  Target,
  ShieldCheck,
  Hammer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { values } from "@/data/values";

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  gem: Gem,
  target: Target,
  "shield-check": ShieldCheck,
  hammer: Hammer,
  zap: Zap,
};

export function ValuesGrid({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Why ProEduvate"
          title="What we optimize for."
          align={expanded ? "left" : "center"}
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = iconMap[value.icon];
            return (
              <AnimatedReveal key={value.title} className="h-full">
                <Card className="h-full">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-medium text-black">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {expanded ? value.longDescription : value.shortDescription}
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
