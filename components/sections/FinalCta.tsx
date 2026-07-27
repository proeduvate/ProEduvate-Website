import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function FinalCta() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container className="text-center">
        <AnimatedReveal>
          <h2 className="text-balance mx-auto max-w-2xl text-3xl font-medium text-chalk sm:text-4xl md:text-5xl">
            Let&apos;s build something together.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" size="lg">
              Start a Conversation
            </Button>
            <Button href="/careers" variant="ghost" size="lg" className="border border-white/10">
              Explore Careers
            </Button>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
