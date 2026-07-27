import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function CtaBand({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container className="text-center">
        <AnimatedReveal>
          <h2 className="text-balance mx-auto max-w-2xl text-2xl font-medium text-chalk sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-gray-400">{description}</p>
          )}
          <div className="mt-8">
            <Button href={ctaHref} size="lg">
              {ctaLabel}
            </Button>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
