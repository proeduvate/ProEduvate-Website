"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BracketFrame } from "@/components/ui/BracketFrame";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";
import { services } from "@/data/services";

/*
 * Products and services as a node graph branching out of a central hub.
 *
 * Same reasoning as the sector ring: this is CSS 3D rather than WebGL
 * because every node is a real link with real text. Keeping it in the DOM
 * means the graph is crawlable, keyboard navigable and readable by a screen
 * reader, which matters more here than in a purely decorative scene -- these
 * nodes are the site's primary navigation into products and services.
 *
 * The two branches are angled toward the viewer on opposite Y rotations, and
 * the whole assembly tilts a few degrees with the pointer.
 */

const BRANCH_COUNT = 6;

type NodeItem = { name: string; meta: string; href: string };

const productNodes: NodeItem[] = products.slice(0, BRANCH_COUNT).map((p) => ({
  name: p.name,
  meta: p.status,
  href: "/products",
}));

const serviceNodes: NodeItem[] = services.slice(0, BRANCH_COUNT).map((s) => ({
  name: s.name,
  meta: "Service",
  href: "/services",
}));

function Branch({
  side,
  label,
  items,
  href,
  linkLabel,
}: {
  side: "left" | "right";
  label: string;
  items: NodeItem[];
  href: string;
  linkLabel: string;
}) {
  const isLeft = side === "left";
  return (
    <div
      className="flex-1"
      style={{
        transform: `rotateY(${isLeft ? 16 : -16}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      <p
        className={cn(
          "label-micro mb-6 text-accent",
          isLeft ? "text-left md:text-right" : "text-left"
        )}
      >
        {label}
      </p>

      <ul className={cn("space-y-3", isLeft && "md:text-right")}>
        {items.map((item, i) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-3.5 transition-all duration-300",
                "hover:border-accent/60 hover:bg-accent/[0.06]",
                isLeft ? "md:flex-row-reverse" : ""
              )}
              style={{
                // Stagger depth so the column reads as a receding row of
                // nodes rather than a flat list.
                transform: `translateZ(${(BRANCH_COUNT - i) * 9}px)`,
              }}
            >
              {/* Connector stub pointing back toward the hub. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 hidden h-px w-6 bg-white/15 transition-colors duration-300 group-hover:bg-accent md:block",
                  isLeft ? "right-full" : "left-full"
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-accent md:block",
                  isLeft ? "right-[calc(100%+1.5rem)]" : "left-[calc(100%+1.5rem)]"
                )}
              />

              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-base text-chalk">
                  {item.name}
                </span>
                <span className="label-micro mt-1 block text-gray-500">{item.meta}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={cn("mt-6", isLeft && "md:text-right")}>
        <Link
          href={href}
          className="label-micro inline-flex items-center gap-1.5 text-gray-400 transition-colors hover:text-accent"
        >
          {linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function CapabilityGraph() {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const px = useSpring(0, { stiffness: 120, damping: 22 });
  const py = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useTransform(px, [-1, 1], [-7, 7]);
  const rotateX = useTransform(py, [-1, 1], [5, -5]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = stageRef.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
    function onLeave() {
      px.set(0);
      py.set(0);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [shouldReduceMotion, px, py]);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <BracketFrame inset="inset-8" />

      <Container className="relative">
        <SectionHeading
          index="02"
          eyebrow="Products & Services"
          title="One hub. Two branches."
          description="Everything we run and everything we build for clients comes out of the same team and the same standard."
          align="center"
        />
      </Container>

      <div ref={stageRef} className="relative mt-16" style={{ perspective: "1500px" }}>
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { rotateX, rotateY, transformStyle: "preserve-3d" }
          }
        >
          <Container>
            <div className="flex flex-col items-stretch gap-12 md:flex-row md:items-center md:gap-8 lg:gap-16">
              <Branch
                side="left"
                label="Products we run"
                items={productNodes}
                href="/products"
                linkLabel="All 17 products"
              />

              {/* Hub */}
              <div
                className="flex shrink-0 flex-col items-center"
                style={{ transform: "translateZ(70px)" }}
              >
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-accent/40 bg-accent/[0.07]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full border border-accent/25"
                    style={{ animationDuration: "3.5s" }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -inset-6 rounded-full opacity-40 blur-2xl"
                    style={{ background: "var(--color-accent)" }}
                  />
                  <span className="relative text-center font-display text-sm leading-tight text-chalk">
                    Pro
                    <br />
                    Eduvate
                  </span>
                </div>
                <span className="label-micro mt-4 text-gray-500">The hub</span>
              </div>

              <Branch
                side="right"
                label="Services we deliver"
                items={serviceNodes}
                href="/services"
                linkLabel="All services"
              />
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
