"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductGlyph } from "@/components/ui/ProductGlyph";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/data/products";

export const categoryColor: Record<ProductCategory, string> = {
  EdTech: "var(--color-category-edtech)",
  "IT & Enterprise": "var(--color-category-enterprise)",
  AI: "var(--color-category-ai)",
};

const statusDot: Record<Product["status"], string> = {
  Live: "bg-success",
  Beta: "bg-warning",
  "Coming Soon": "bg-gray-400",
};

// Sample art -- free-license stock 3D renders standing in for real product
// marks/screenshots, cycled across however many products there are. Swap
// for real per-product art once it exists.
const sampleImages = [
  "/products/learnsphere.jpg",
  "/products/tutorly-ai.jpg",
  "/products/campusos.jpg",
  "/products/credentia.jpg",
  "/products/flowforge.jpg",
  "/products/pulseboard.jpg",
  "/products/devrail.jpg",
  "/products/assistiq.jpg",
];

export function ProductStoryPanel({
  product,
  index,
  total,
  align,
}: {
  product: Product;
  index: number;
  total: number;
  align: "left" | "right";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const accent = categoryColor[product.category];
  const isRight = align === "right";
  const imageSrc = sampleImages[index % sampleImages.length];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const washY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const glyphY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      id={product.slug}
      ref={sectionRef}
      className="relative flex min-h-screen scroll-mt-20 items-center overflow-hidden border-t border-white/5 bg-black py-24"
    >
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 h-[60vh] w-[60vh] -translate-y-1/2 rounded-full opacity-25 blur-[120px]",
          isRight ? "-left-40" : "-right-40"
        )}
        style={{ background: accent, y: washY }}
      />
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 font-display font-semibold text-white/[0.035] select-none",
          isRight ? "-left-[3vw]" : "-right-[3vw]"
        )}
        style={{ y: numberY, fontSize: "clamp(96px, 26vw, 420px)", lineHeight: 1 }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden="true" />

      {/* Floating 3D emblem filling the space opposite the text */}
      <motion.div
        aria-hidden="true"
        className={cn("pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block", isRight ? "left-[6%]" : "right-[6%]")}
        style={{ y: glyphY }}
      >
        <ProductGlyph imageSrc={imageSrc} alt={`${product.name} — abstract sample art`} accent={accent} />
      </motion.div>

      <Container className="relative">
        <div className={cn("max-w-2xl", isRight && "ml-auto text-right")}>
          <AnimatedReveal>
            <div
              className={cn(
                "flex items-center gap-3 text-xs font-medium tracking-wide text-gray-500 uppercase",
                isRight && "justify-end"
              )}
            >
              <span className="tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-700" />
              <span style={{ color: accent }}>{product.category}</span>
              <span className="h-1 w-1 rounded-full bg-gray-700" />
              <span className="inline-flex items-center gap-1.5 text-gray-400">
                <span className="relative flex h-1.5 w-1.5">
                  {product.status === "Live" && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  )}
                  <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", statusDot[product.status])} />
                </span>
                {product.status}
              </span>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.08}>
            <h2 className="text-balance mt-6 text-6xl font-medium text-white sm:text-7xl md:text-8xl">
              {product.name}
            </h2>
          </AnimatedReveal>

          <AnimatedReveal delay={0.16}>
            <p className={cn("mt-6 max-w-lg text-lg text-gray-400 sm:text-xl", isRight && "ml-auto")}>
              {product.description}
            </p>
          </AnimatedReveal>

          {product.highlights && (
            <AnimatedReveal delay={0.22}>
              <ul className={cn("mt-6 max-w-lg space-y-2", isRight && "ml-auto")}>
                {product.highlights.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-start gap-2.5 text-sm text-gray-500",
                      isRight && "flex-row-reverse text-right"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedReveal>
          )}

          {product.metric && (
            <AnimatedReveal delay={0.24}>
              <div className={cn("mt-10 flex items-end gap-6", isRight && "flex-row-reverse")}>
                <div>
                  <div className="font-display text-4xl font-semibold text-white">{product.metric.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{product.metric.label}</div>
                </div>
                {product.sparkline && <Sparkline data={product.sparkline} stroke={accent} className="h-16 w-32" />}
              </div>
            </AnimatedReveal>
          )}

          <AnimatedReveal delay={0.32}>
            <div className={cn("mt-10 flex items-center gap-4", isRight && "justify-end")}>
              <Button
                href={product.externalUrl}
                size="lg"
                variant={product.status === "Coming Soon" ? "outline-light" : "primary"}
              >
                {product.status === "Coming Soon" ? "Notify Me" : "View Product"}
              </Button>
            </div>
          </AnimatedReveal>
        </div>
      </Container>
    </section>
  );
}
