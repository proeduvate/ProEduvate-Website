import {
  BrainCircuit,
  Code2,
  Palette,
  GraduationCap,
  Megaphone,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { internshipTracks } from "@/data/benefits";

const iconMap: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  "code-2": Code2,
  palette: Palette,
  "graduation-cap": GraduationCap,
  megaphone: Megaphone,
  "bar-chart-3": BarChart3,
};

export function TracksGrid() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Tracks" title="Pick the track that fits you." align="center" />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {internshipTracks.map((track) => {
            const Icon = iconMap[track.icon];
            return (
              <AnimatedReveal key={track.name} className="h-full">
                <Card className="h-full">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-medium text-chalk">{track.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{track.description}</p>
                </Card>
              </AnimatedReveal>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
