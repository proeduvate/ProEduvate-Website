import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";

const steps = [
  { title: "Discover", description: "We map the problem, users, and constraints before writing a line of code." },
  { title: "Design", description: "Wireframes and prototypes validated with real stakeholders and users." },
  { title: "Build", description: "Iterative development in reviewable increments, with tests as we go." },
  { title: "Launch", description: "Staged rollout with monitoring, so launch day is uneventful by design." },
  { title: "Support", description: "Ongoing maintenance, iteration, and scaling support after go-live." },
];

export function Process() {
  return (
    <section className="bg-off-white py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="How We Work" title="A process built for momentum." align="center" />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <AnimatedReveal key={step.title} className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <span className="font-display text-3xl font-medium text-accent/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium text-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
