import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { stats } from "@/data/stats";

export function StatsBand() {
  return (
    <section className="border-y border-white/10 bg-surface py-16 md:py-20">
      <Container>
        <Stagger className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedReveal key={stat.label}>
              <div className="border-white/10 py-6 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                <p className="label-micro mb-4 flex items-center gap-2 text-gray-500">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-4 bg-white/20" aria-hidden="true" />
                  {stat.label}
                </p>
                <div className="display-md font-display text-chalk tabular-nums">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
