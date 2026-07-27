import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function LegalContent({
  lastUpdated,
  sections,
}: {
  lastUpdated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container className="max-w-3xl">
        <AnimatedReveal>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-medium text-chalk">{section.heading}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="mt-3 leading-relaxed text-gray-400">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
