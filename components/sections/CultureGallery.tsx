import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";

// STUB: gradient placeholder blocks stand in for real team/office
// photography, per the project brief (no stock photos used). Replace each
// block with a real <Image /> once photography is available.
const snapshots = [
  { label: "Team offsite", gradient: "from-primary via-primary-2 to-accent" },
  { label: "Deep work day", gradient: "from-black via-primary to-primary-2" },
  { label: "Product launch day", gradient: "from-accent via-primary-2 to-black" },
  { label: "Weekly demo Friday", gradient: "from-primary-2 via-accent to-accent-glow" },
];

export function CultureGallery() {
  return (
    <section className="bg-surface-2 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Culture" title="A glimpse at how we work." align="center" />

        <Stagger className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {snapshots.map((snapshot) => (
            <AnimatedReveal key={snapshot.label}>
              <div
                className={`relative flex aspect-[3/4] items-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 ${snapshot.gradient}`}
              >
                <p className="text-sm font-medium text-white/90">{snapshot.label}</p>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>

        <div className="mt-14 text-center">
          <Button href="/careers" size="lg">
            See Open Roles
          </Button>
        </div>
      </Container>
    </section>
  );
}
