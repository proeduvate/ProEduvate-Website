import {
  Clock,
  BookOpen,
  HeartPulse,
  TrendingUp,
  Home,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { benefits } from "@/data/benefits";

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  "book-open": BookOpen,
  "heart-pulse": HeartPulse,
  "trending-up": TrendingUp,
  home: Home,
  users: Users,
};

export function BenefitsGrid() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Why Work Here" title="Built for people who ship." align="center" />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <AnimatedReveal key={benefit.title} className="h-full">
                <Card className="h-full">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-medium text-chalk">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {benefit.description}
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
