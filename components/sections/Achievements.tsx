import { Star, Trophy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { achievementHighlights, monthlyStars, recognitions } from "@/data/achievements";

export function Achievements() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <SectionHeading index="02" eyebrow="Along the Way" title="Achievements we're proud of." />

        {/* Headline numbers, set on the display scale rather than in cards. */}
        <Stagger className="mt-16 grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
          {achievementHighlights.map((item) => (
            <AnimatedReveal key={item.label}>
              <div className="border-b border-white/10 py-10 sm:border-r sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:border-r-0">
                <div className="display-md font-display text-chalk">
                  <Counter value={item.value} suffix={item.suffix} />
                </div>
                <p className="label-micro mt-4 text-gray-500">{item.label}</p>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>

        {/* Star of the month, as a ledger rather than a card grid. */}
        <div className="mt-24">
          <AnimatedReveal>
            <div className="label-micro flex items-center gap-3 text-accent">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Star of the Month</span>
            </div>
          </AnimatedReveal>

          <div className="mt-8 border-t border-white/10">
            {monthlyStars.map((star, i) => (
              <AnimatedReveal key={star.month} delay={i * 0.04}>
                <div className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.02]">
                  <span className="label-micro w-24 shrink-0 text-gray-500">{star.month}</span>
                  <span className="flex-1 font-display text-xl font-normal text-chalk transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                    {star.name}
                  </span>
                  <span className="label-mono text-gray-500">{star.department}</span>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="mt-24">
          <AnimatedReveal>
            <div className="label-micro flex items-center gap-3 text-accent">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Recognition</span>
            </div>
          </AnimatedReveal>

          <Stagger className="mt-8 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {recognitions.map((item) => (
              <AnimatedReveal key={item.title} className="h-full">
                <div className="h-full border-b border-white/10 py-8 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                  <p className="label-micro text-gray-500">{item.title}</p>
                  <p className="mt-3 font-display text-lg font-normal text-chalk">
                    {item.description}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
