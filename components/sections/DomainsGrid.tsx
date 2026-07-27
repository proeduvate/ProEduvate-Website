import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { domains } from "@/data/domains";

export function DomainsGrid() {
  return (
    <section className="border-t border-white/10 bg-black py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Capabilities"
          title="Domains we work on."
          description="The technical disciplines behind every product and client engagement we ship."
          dark
          align="center"
        />

        <Stagger className="mt-14 flex flex-wrap justify-center gap-3">
          {domains.map((domain) => (
            <AnimatedReveal key={domain}>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors duration-300 hover:border-accent/50 hover:text-white">
                {domain}
              </span>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
