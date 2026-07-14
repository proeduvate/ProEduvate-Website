import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Container } from "@/components/ui/Container";

export function Statement({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-black py-28 md:py-40">
      <Container>
        <AnimatedReveal y={40}>
          <p className="text-balance mx-auto max-w-4xl text-center text-3xl font-medium text-white sm:text-4xl md:text-6xl">
            {children}
          </p>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
