import {
  GraduationCap,
  BrainCircuit,
  Building2,
  Palette,
  Cloud,
  Database,
  Compass,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
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
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedReveal key={service.slug} className="h-full">
                <Card spotlight className="h-full">
                  <Icon className="h-9 w-9 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-medium text-black">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {service.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {service.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </AnimatedReveal>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
