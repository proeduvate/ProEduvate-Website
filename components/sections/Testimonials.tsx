import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, type Testimonial } from "@/data/testimonials";

/**
 * Infinite-scroll marquee testimonials, pause-on-hover, gradient-fade
 * edges — adapted from 21st.dev's "Testimonials with Marquee" (sourced via
 * the 21st.dev MCP) to this project's tokens and data shape (initials
 * avatars instead of hotlinked photos, per the no-stock-photography rule).
 */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col rounded-2xl border border-gray-200 bg-white p-7 text-left transition-colors duration-300 hover:border-accent/30">
      <Quote className="h-6 w-6 text-accent/40" aria-hidden="true" />
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-700">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-black">{testimonial.name}</p>
          <p className="text-xs text-gray-500">
            {testimonial.role}, {testimonial.org}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-off-white py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Impact" title="What partners say." align="center" />
      </Container>

      <div className="group relative mt-14 flex overflow-hidden">
        <div className="flex w-max shrink-0 animate-marquee gap-6 py-2 group-hover:[animation-play-state:paused]">
          {loop.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-off-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-off-white to-transparent" />
      </div>
    </section>
  );
}
