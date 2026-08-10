"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { InternReview } from "@/data/intern-reviews";

/**
 * Depth backdrop for the reviews: a receding floor grid with a row of quote
 * glyphs suspended at different distances above it.
 *
 * Purely decorative, so it is aria-hidden and driven entirely by CSS 3D and
 * keyframes -- no rAF loop and no WebGL context competing with the sections
 * either side of it. Sizes are in vw/vh so the perspective holds up across
 * viewports.
 */
function ReviewsBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 motion-reduce:hidden"
      style={{ perspective: "2100px", perspectiveOrigin: "50% 30%" }}
    >
      {/* Receding floor */}
      <div
        className="bg-grid absolute inset-x-[-25%] bottom-[-10%] h-[70%] opacity-[0.28]"
        style={{
          transform: "rotateX(74deg)",
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, black, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent 78%)",
        }}
      />

      {/* Floating quote marks at staggered depths */}
      {[
        { left: "8%", top: "18%", z: -260, size: 190, delay: "0s" },
        { left: "38%", top: "8%", z: -420, size: 130, delay: "-5s" },
        { left: "72%", top: "22%", z: -190, size: 220, delay: "-9s" },
        { left: "88%", top: "58%", z: -340, size: 150, delay: "-3s" },
      ].map((q) => (
        <span
          key={q.left}
          className="animate-[--animate-aurora-slow] absolute font-display leading-none text-accent/[0.07] select-none"
          style={{
            left: q.left,
            top: q.top,
            fontSize: `${q.size}px`,
            transform: `translateZ(${q.z}px)`,
            animationDelay: q.delay,
          }}
        >
          &rdquo;
        </span>
      ))}

      {/* Horizon glow where the floor meets the cards */}
      <div
        className="absolute inset-x-0 bottom-[28%] h-[30vh] opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, var(--color-accent), transparent 70%)",
        }}
      />
    </div>
  );
}

/**
 * Horizontally scrollable intern reviews, three per view on desktop.
 *
 * Uses native scroll with CSS scroll-snap rather than a transform-based
 * carousel, so touch, trackpad, and keyboard all work for free and the
 * cards stay in the accessibility tree. The arrows just drive scrollBy.
 */
export function InternReviews({ internReviews }: { internReviews: InternReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  function page(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    // One "page" is one card plus its gap.
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth / 3;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface-2 py-24 md:py-32">
      <ReviewsBackdrop />

      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="04"
            eyebrow="Impact"
            title="What our interns say."
            description="Reviews from the people who built alongside us."
            className="max-w-2xl"
          />
          {/* The names are real; the words are not yet. Say so rather than
              letting drafted copy read as a quotation from a named person. */}
          {internReviews.some((r) => !r.quoteApproved) && (
            <p className="label-micro w-full border border-white/15 px-3 py-2 text-gray-500">
              Quotes are drafts pending each intern&apos;s own words
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Previous reviews"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-chalk transition-all duration-200",
                atStart ? "opacity-30" : "hover:border-accent hover:text-accent"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="Next reviews"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-chalk transition-all duration-200",
                atEnd ? "opacity-30" : "hover:border-accent hover:text-accent"
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {internReviews.map((review, i) => (
            <article
              key={`${review.track}-${i}`}
              className="group flex w-[85%] shrink-0 snap-start flex-col border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-accent/40 sm:w-[47%] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-6 w-6 text-accent/40" aria-hidden="true" />
                <span className="label-micro text-gray-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <blockquote className="mt-6 flex-1 text-base leading-relaxed text-gray-300">
                {review.quote}
              </blockquote>

              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="font-display text-lg font-normal text-chalk">{review.name}</p>
                <p className="label-micro mt-2 text-gray-500">{review.track}</p>
                <p className="label-micro mt-1 text-gray-600">{review.cohort}</p>
              </figcaption>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
