import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { products } from "@/data/products";

export function ProductsConsoleHero() {
  const stats = [
    { label: "Products", value: products.length },
    { label: "Live", value: products.filter((p) => p.status === "Live").length },
    { label: "In beta", value: products.filter((p) => p.status === "Beta").length },
    { label: "Coming soon", value: products.filter((p) => p.status === "Coming Soon").length },
  ];

  return (
    <section className="relative overflow-hidden bg-black pt-40 pb-16 md:pt-48 md:pb-20">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 10%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent)",
        }}
      />
      <Container className="relative">
        <AnimatedReveal>
          <Badge tone="outline" className="mb-6">
            Our Products
          </Badge>
          <h1 className="text-balance max-w-3xl text-4xl font-medium text-white sm:text-5xl md:text-6xl">
            Products we build and run ourselves.
          </h1>
          <p className="text-balance mt-6 max-w-xl text-lg text-gray-300">
            ProEduvate is a product company first. This page is an intentionally minimal
            overview — full detail, screenshots, and documentation live on our dedicated
            product portfolio site.
          </p>
        </AnimatedReveal>

        <AnimatedReveal delay={0.15}>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="sm:px-6 sm:first:pl-0">
                <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">{stat.label}</dt>
                <dd className="mt-1.5 font-display text-3xl font-semibold text-white tabular-nums">
                  <AnimatedCounter value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
