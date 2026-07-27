import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-surface-2 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Impact"
          title="What our customers say."
          align="center"
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <AnimatedReveal key={testimonial.name} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-8">
                <Quote className="h-7 w-7 text-accent/40" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-gray-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-chalk">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role}, {testimonial.org}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
