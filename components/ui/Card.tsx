"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/Spotlight";

export function Card({
  children,
  className,
  dark = false,
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  /** Cursor-following glow on hover — use sparingly (product/service/pillar cards). */
  spotlight?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
        dark
          ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
          : "border-gray-200 bg-white hover:border-accent/30 hover:shadow-[0_20px_60px_-24px_rgba(20,113,240,0.25)]",
        className
      )}
    >
      {spotlight && !shouldReduceMotion && (
        <Spotlight
          size={280}
          className={
            dark
              ? "from-accent/40 via-accent-glow/20 to-transparent"
              : "from-accent/15 via-accent-2/10 to-transparent"
          }
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
