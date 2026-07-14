import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-black pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 10%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent)",
        }}
      />
      <Container className="relative">
        <AnimatedReveal>
          <Badge tone="outline" className="mb-6">
            {eyebrow}
          </Badge>
          <h1 className="text-balance max-w-3xl text-4xl font-medium text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="text-balance mt-6 max-w-xl text-lg text-gray-300">{description}</p>
          )}
          {children}
        </AnimatedReveal>
      </Container>
    </section>
  );
}
