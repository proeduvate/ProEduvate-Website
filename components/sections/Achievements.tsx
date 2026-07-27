import { Star, Trophy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Counter } from "@/components/ui/Counter";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { achievementHighlights, monthlyStars, recognitions } from "@/data/achievements";

export function Achievements() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Along the Way" title="Achievements we're proud of." />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {achievementHighlights.map((item) => (
            <AnimatedReveal key={item.label}>
              <Card className="text-center">
                <div className="font-display text-4xl font-medium text-black sm:text-5xl">
                  <Counter value={item.value} suffix={item.suffix} />
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.label}</p>
              </Card>
            </AnimatedReveal>
          ))}
        </Stagger>

        <div className="mt-20">
          <AnimatedReveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Recognition
            </p>
            <h3 className="mt-2 text-2xl font-medium text-black">Star of the Month.</h3>
          </AnimatedReveal>

          <Stagger className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {monthlyStars.map((star) => (
              <AnimatedReveal key={star.month} className="h-full">
                <Card className="h-full">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-accent uppercase">
                    <Star className="h-4 w-4" aria-hidden="true" />
                    {star.month}
                  </div>
                  <h4 className="mt-4 text-lg font-medium text-black">{star.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{star.department}</p>
                </Card>
              </AnimatedReveal>
            ))}
          </Stagger>
        </div>

        <div className="mt-16">
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recognitions.map((item) => (
              <AnimatedReveal key={item.title} className="h-full">
                <Card className="h-full bg-off-white">
                  <Trophy className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h4 className="mt-4 text-base font-medium text-black">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </Card>
              </AnimatedReveal>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
