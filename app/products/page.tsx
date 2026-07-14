import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ProductsFilterGrid } from "@/components/sections/ProductsFilterGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "A minimal overview of the products ProEduvate builds and runs across EdTech, IT & Enterprise, and AI.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title="Products we build and run ourselves."
        description="ProEduvate is a product company first. This page is an intentionally minimal overview — full detail, screenshots, and documentation live on our dedicated product portfolio site."
      />

      <section className="bg-white py-20 md:py-28">
        <Container>
          <ProductsFilterGrid />
        </Container>
      </section>

      <CtaBand
        title="Have a product idea or partnership in mind?"
        description="We're always open to conversations about new products, integrations, or institutional partnerships."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </>
  );
}
