"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { GraduationCap, Cpu, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Spotlight } from "@/components/ui/Spotlight";

const pillars = [
  {
    icon: GraduationCap,
    title: "EdTech",
    description:
      "Learning platforms, adaptive tutoring, and campus systems built for institutions that need software as rigorous as their curriculum.",
    href: "/products",
    linkLabel: "See our EdTech products",
  },
  {
    icon: Cpu,
    title: "IT & Enterprise / AI",
    description:
      "AI automation, analytics, and enterprise platforms engineered for teams that need reliable software, not another proof of concept.",
    href: "/services",
    linkLabel: "See our services",
  },
];

export function Pillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Two disciplines. One standard of craft."
          description="ProEduvate operates across EdTech and IT/enterprise software, building our own products and shipping custom work for clients in both."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <AnimatedReveal key={pillar.title}>
              <Link
                href={pillar.href}
                className="group relative block h-full overflow-hidden rounded-3xl border border-gray-200 bg-off-white p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_30px_80px_-30px_rgba(20,113,240,0.25)] md:p-10"
              >
                {!shouldReduceMotion && (
                  <Spotlight size={320} className="from-accent/15 via-accent-2/10 to-transparent" />
                )}
                <div className="relative z-10">
                  <pillar.icon className="h-9 w-9 text-accent" aria-hidden="true" />
                  <h3 className="mt-6 text-2xl font-medium text-black md:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {pillar.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    {pillar.linkLabel}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
