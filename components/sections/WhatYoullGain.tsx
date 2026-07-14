import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { internshipGains } from "@/data/benefits";

export function WhatYoullGain() {
  return (
    <section className="bg-black py-20 md:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="What You'll Gain"
          title="Real work. Real mentorship. Real portfolio."
          dark
        />
        <Stagger className="space-y-4">
          {internshipGains.map((gain) => (
            <AnimatedReveal key={gain} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-glow" aria-hidden="true" />
              <p className="text-gray-200">{gain}</p>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
