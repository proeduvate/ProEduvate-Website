import { Container } from "@/components/ui/Container";
import { AnimatedReveal, Stagger } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";

const items = [
  { label: "Duration", value: "3 or 6 months" },
  { label: "Compensation", value: "Paid internship" },
  { label: "Format", value: "Remote, hybrid, or on-site" },
  { label: "Mentorship", value: "1:1 senior mentor, every intern" },
];

export function ProgramOverview() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <AnimatedReveal key={item.label}>
              <div className="rounded-2xl border border-gray-200 bg-off-white p-6">
                <Badge tone="neutral" className="mb-3">
                  {item.label}
                </Badge>
                <p className="text-lg font-medium text-black">{item.value}</p>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
