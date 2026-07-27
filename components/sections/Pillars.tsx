import {
  GraduationCap,
  Accessibility,
  Stethoscope,
  Code2,
  BrainCircuit,
  UsersRound,
  Cloud,
  Database,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { sectors } from "@/data/sectors";

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  accessibility: Accessibility,
  stethoscope: Stethoscope,
  code: Code2,
  "brain-circuit": BrainCircuit,
  users: UsersRound,
  cloud: Cloud,
  database: Database,
};

export function Pillars() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Eight sectors. One standard of craft."
          description="ProEduvate builds and ships across eight sectors, applying the same standard of craft to our own products and to client work alike."
        />

        <div className="mt-16 border-t border-gray-200">
          {sectors.map((sector, i) => {
            const Icon = iconMap[sector.icon];
            return (
              <AnimatedReveal key={sector.title} delay={i * 0.04}>
                <div className="group relative border-b border-gray-200">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-full w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
                  />
                  <div className="flex flex-col gap-3 py-7 pl-6 transition-colors duration-300 group-hover:bg-accent/[0.03] md:flex-row md:items-center md:justify-between md:gap-6 md:py-9">
                    <div className="flex items-baseline gap-4 md:gap-7">
                      <span className="font-display text-sm text-gray-400 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-2xl font-medium text-black transition-colors duration-300 group-hover:text-accent sm:text-3xl md:text-4xl">
                        {sector.title}
                      </h3>
                    </div>

                    <p className="pl-9 text-sm text-gray-500 md:max-w-xs md:pl-0 md:text-right">
                      {sector.description}
                    </p>

                    <div className="hidden shrink-0 items-center gap-4 pr-2 md:flex">
                      <Icon
                        className="h-6 w-6 scale-75 text-accent opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      <ArrowUpRight
                        className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
