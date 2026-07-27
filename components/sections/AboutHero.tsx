import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ProductGlyph } from "@/components/ui/ProductGlyph";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-black pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 10%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
          <AnimatedReveal className="max-w-2xl">
            <Badge tone="outline" className="mb-6">
              About Us · Est. Aug 2025
            </Badge>
            <h1 className="text-balance text-4xl font-medium text-white sm:text-5xl md:text-6xl">
              Software built by people who care what it&apos;s for.
            </h1>
            <p className="text-balance mt-6 max-w-xl text-lg text-gray-300">
              ProEduvate started as a small team frustrated with clunky institutional
              software — and grew into a product company building across eight sectors.
            </p>
          </AnimatedReveal>

          <div className="hidden shrink-0 lg:block">
            <ProductGlyph imageSrc="/icon.png" alt="ProEduvate" accent="var(--color-accent)" />
          </div>
        </div>
      </Container>
    </section>
  );
}
