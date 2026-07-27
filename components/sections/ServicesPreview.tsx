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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
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

export function ServicesPreview() {
  const featured = services.slice(0, 4);

  return (
    <section className="bg-surface-2 py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Services"
            title="Custom software for clients who need our craft."
            className="max-w-xl"
          />
          <AnimatedReveal delay={0.15}>
            <Button href="/services" variant="secondary" className="border border-white/10">
              View All Services
            </Button>
          </AnimatedReveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedReveal key={service.slug} className="h-full">
                <Card className="h-full">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-medium text-chalk">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {service.description}
                  </p>
                </Card>
              </AnimatedReveal>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
