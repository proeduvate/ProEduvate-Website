import {
  Lightbulb,
  Gem,
  Target,
  ShieldCheck,
  Hammer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { cn } from "@/lib/utils";
import { values } from "@/data/values";

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  gem: Gem,
  target: Target,
  "shield-check": ShieldCheck,
  hammer: Hammer,
  zap: Zap,
};

export function ValuesGrid({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Why ProEduvate"
          title="What we optimize for."
          description="Not a list of features. This is what decides how we build, who we hire, and what we ship."
          align={expanded ? "left" : "center"}
        />

        <div className="mt-16 border-t border-gray-200 md:mt-20">
          {values.map((value, i) => {
            const Icon = iconMap[value.icon];
            return (
              <AnimatedReveal key={value.title} delay={i * 0.05}>
                <div
                  className={cn(
                    "flex flex-col gap-4 border-b border-gray-200 py-10 md:flex-row md:items-start md:gap-12 md:py-14"
                  )}
                >
                  <div className="flex items-center gap-4 md:w-2/5">
                    <span className="font-display text-sm text-gray-400 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <h3 className="font-display text-3xl font-medium text-black sm:text-4xl md:text-5xl">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-gray-600 md:w-3/5 md:pt-2 md:text-lg">
                    {expanded ? value.longDescription : value.shortDescription}
                  </p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
