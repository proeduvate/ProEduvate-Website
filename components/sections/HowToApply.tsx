import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";

const steps = [
  { title: "Apply", description: "Submit your application to a track or open internship role." },
  { title: "Interview", description: "A short conversation with the team you'd be working alongside." },
  { title: "Offer", description: "Accept your offer and get matched with a mentor before day one." },
];

export function HowToApply() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="How to Apply" title="Three steps to get started." align="center" />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedReveal key={step.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-semibold text-accent">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-medium text-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
