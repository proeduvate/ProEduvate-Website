import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { customProjects } from "@/data/custom-projects";

export function CustomProjectsGrid() {
  return (
    <section className="border-t border-white/10 bg-black py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Client Work"
          title="Custom software we've built."
          description="A sample of the custom projects we've delivered for clients across industries."
          dark
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customProjects.map((project, i) => (
            <AnimatedReveal key={project.name} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-accent/40">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm text-gray-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-white">{project.name}</span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-500">
                  {project.description}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
