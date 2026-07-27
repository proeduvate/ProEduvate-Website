import {
  GraduationCap,
  BrainCircuit,
  Building2,
  Palette,
  Cloud,
  Database,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { services } from "@/data/services";

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  palette: Palette,
  cloud: Cloud,
  database: Database,
  compass: Compass,
};

export function ServicesGrid() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <div className="border-t border-white/10">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedReveal key={service.slug} delay={Math.min(i * 0.04, 0.2)}>
                <article className="group grid grid-cols-1 gap-6 border-b border-white/10 py-12 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[auto_1fr_1fr] md:gap-12 md:py-16">
                  <div className="label-micro flex items-center gap-3 text-gray-500 md:block">
                    <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <Icon
                      className="mt-6 hidden h-7 w-7 text-accent transition-transform duration-300 group-hover:scale-110 md:block"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="display-md text-balance text-chalk transition-colors duration-300 group-hover:text-accent">
                    {service.name}
                  </h3>

                  <div>
                    <p className="text-base leading-relaxed text-gray-400">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {service.included.map((item) => (
                        <li
                          key={item}
                          className="label-mono flex items-start gap-3 text-gray-500"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </AnimatedReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
