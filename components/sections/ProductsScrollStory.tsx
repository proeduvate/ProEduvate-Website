"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ProductStoryPanel, categoryColor } from "@/components/sections/ProductStoryPanel";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductsScrollStory({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // `products` is a prop now, so it can in principle arrive empty.
  const [activeSlug, setActiveSlug] = useState(products[0]?.slug ?? "");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });

  useEffect(() => {
    const sections = products
      .map((p) => document.getElementById(p.slug))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSlug(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // Rebinds if the list changes -- it is data now, not a module constant.
  }, [products]);

  return (
    <div ref={containerRef} className="relative">
      {/* Reading progress rail */}
      <div
        aria-hidden="true"
        className="fixed top-18 right-0 left-0 z-30 h-0.5 bg-white/5"
      >
        <motion.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
      </div>

      {/* Scroll-spy jump nav */}
      <nav
        aria-label="Jump to product"
        className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {products.map((product) => {
          const isActive = activeSlug === product.slug;
          return (
            <a
              key={product.slug}
              href={`#${product.slug}`}
              aria-current={isActive || undefined}
              className="group flex items-center gap-2.5"
            >
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                  isActive && "opacity-100 text-white"
                )}
              >
                {product.name}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: isActive ? categoryColor[product.category] : "rgba(255,255,255,0.25)",
                  backgroundColor: isActive ? categoryColor[product.category] : "transparent",
                  transform: isActive ? "scale(1.4)" : "scale(1)",
                }}
              />
            </a>
          );
        })}
      </nav>

      {products.map((product, index) => (
        <ProductStoryPanel
          key={product.slug}
          product={product}
          index={index}
          total={products.length}
          align={index % 2 === 0 ? "left" : "right"}
        />
      ))}
    </div>
  );
}
