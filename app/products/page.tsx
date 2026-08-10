import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ProductsConsoleHero } from "@/components/sections/ProductsConsoleHero";
import { ProductsScrollStory } from "@/components/sections/ProductsScrollStory";
import { getProductsByStatus } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "A minimal overview of the products ProEduvate builds and runs across EdTech, IT & Enterprise, and AI.",
};

export default async function ProductsPage() {
  // Fetched once on the server and passed down, so the two sections cannot
  // disagree and the browser never waits on the API.
  const products = await getProductsByStatus();

  return (
    <>
      <ProductsConsoleHero products={products} />

      <ProductsScrollStory products={products} />

      <section className="border-t border-white/10 bg-black py-20 md:py-28">
        <Container className="text-center">
          <AnimatedReveal>
            <h2 className="text-balance mx-auto max-w-2xl text-2xl font-medium text-white sm:text-3xl md:text-4xl">
              Have a product idea or partnership in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              We&apos;re always open to conversations about new products, integrations, or
              institutional partnerships.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg">
                Get in Touch
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
