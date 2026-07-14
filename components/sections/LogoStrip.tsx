import { clientLogos } from "@/data/tech-stack";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function LogoStrip({
  dark = true,
  label = "Trusted by institutions & partners",
  items = clientLogos,
}: {
  dark?: boolean;
  label?: string;
  items?: string[];
}) {
  const loop = [...items, ...items];

  return (
    <section className={dark ? "border-t border-white/10 bg-black py-14" : "bg-off-white py-14"}>
      <Container>
        <AnimatedReveal>
          <p
            className={
              "mb-8 text-center text-xs font-semibold tracking-[0.2em] uppercase " +
              (dark ? "text-gray-400" : "text-gray-600")
            }
          >
            {label}
          </p>
        </AnimatedReveal>
      </Container>
      <div className="relative overflow-hidden">
        <div
          className={
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r " +
            (dark ? "from-black to-transparent" : "from-off-white to-transparent")
          }
        />
        <div
          className={
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l " +
            (dark ? "from-black to-transparent" : "from-off-white to-transparent")
          }
        />
        <div className="flex w-max animate-marquee gap-16 py-2">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className={
                "shrink-0 text-xl font-display font-semibold tracking-tight whitespace-nowrap grayscale transition-all duration-300 hover:grayscale-0 " +
                (dark ? "text-white/40 hover:text-white/90" : "text-gray-400 hover:text-gray-700")
              }
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
