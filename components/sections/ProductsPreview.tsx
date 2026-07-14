import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { products } from "@/data/products";

export function ProductsPreview() {
  const featured = products.slice(0, 6);

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Products"
            title="Products we build and run ourselves."
            description="A minimal look at our in-house product line — full detail lives on our dedicated product site."
            className="max-w-xl"
          />
          <AnimatedReveal delay={0.15}>
            <Button href="/products" variant="secondary" className="border border-gray-200">
              View All Products
            </Button>
          </AnimatedReveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <AnimatedReveal key={product.slug} className="h-full">
              <ProductCard product={product} />
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
