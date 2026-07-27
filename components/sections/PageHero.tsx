import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BracketFrame } from "@/components/ui/BracketFrame";

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
    <section className="relative overflow-hidden bg-surface pt-44 pb-24 md:pt-52 md:pb-32">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 10%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent)",
        }}
      />
      <BracketFrame />

      <Container className="relative">
        <AnimatedReveal>
          <div className="label-micro mb-8 flex items-center gap-3 text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span>{eyebrow}</span>
          </div>

          <h1 className="display-xl text-balance max-w-5xl text-chalk">{title}</h1>

          {description && (
            <p className="text-balance mt-8 max-w-xl text-lg text-gray-400">{description}</p>
          )}
          {children}
        </AnimatedReveal>
      </Container>
    </section>
  );
}
