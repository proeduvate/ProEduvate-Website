import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { stats } from "@/data/stats";

export function StatsBand() {
  return (
    <section className="border-t border-white/10 bg-black py-20 md:py-28">
      <Container>
        <Stagger className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedReveal key={stat.label} className="text-center md:text-left">
              <div className="text-4xl font-display font-medium text-white sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
