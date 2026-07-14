import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <AnimatedReveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold tracking-[0.2em] uppercase",
            dark ? "text-accent-glow" : "text-accent"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-balance text-3xl font-medium sm:text-4xl md:text-5xl",
          dark ? "text-white" : "text-black"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-balance text-base sm:text-lg",
            dark ? "text-gray-200" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedReveal>
  );
}
