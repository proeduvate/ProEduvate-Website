import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

export function CareersTeaser() {
  const partTime = jobs.filter((job) => job.employmentType === "part-time").length;

  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(50% 60% at 15% 30%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent)",
        }}
      />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedReveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent-glow uppercase">
              Join the Team
            </p>
            <h2 className="text-balance text-3xl font-medium text-white sm:text-4xl md:text-5xl">
              Build alongside people who care about the outcome.
            </h2>
            <p className="mt-5 max-w-lg text-base text-gray-300 sm:text-lg">
              We&apos;re a small, high-trust team shipping real products for real
              institutions and clients. Full-time, part-time, and internship
              roles are open across engineering, design, AI, and content.
            </p>
            <div className="mt-8">
              <Magnetic>
                <Button href="/careers" size="lg">
                  See Open Roles
                </Button>
              </Magnetic>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.15} className="grid grid-cols-3 gap-4">
            {[
              { label: "Open Roles", value: jobs.length + internships.length },
              { label: "Part-Time Roles", value: partTime },
              { label: "Internships Open", value: internships.length },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="text-3xl font-display font-medium text-white">
                  <Counter value={item.value} />
                </div>
                <p className="mt-1 text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </AnimatedReveal>
        </div>
      </Container>
    </section>
  );
}
