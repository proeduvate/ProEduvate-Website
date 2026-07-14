"use client";

import { useMemo, useState } from "react";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { cn } from "@/lib/utils";
import { products, type ProductCategory } from "@/data/products";

const filters: { label: string; value: ProductCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "EdTech", value: "EdTech" },
  { label: "IT & Enterprise", value: "IT & Enterprise" },
  { label: "AI", value: "AI" },
];

export function ProductsFilterGrid() {
  const [active, setActive] = useState<ProductCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter products by category">
        {filters.map((filter) => (
          <button
            key={filter.value}
            role="tab"
            aria-selected={active === filter.value}
            onClick={() => setActive(filter.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === filter.value
                ? "border-accent bg-accent text-white"
                : "border-gray-200 text-gray-600 hover:border-accent/40 hover:text-accent"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <AnimatedReveal key={product.slug} className="h-full">
            <ProductCard product={product} />
          </AnimatedReveal>
        ))}
      </Stagger>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No products in this category yet.</p>
      )}
    </div>
  );
}
