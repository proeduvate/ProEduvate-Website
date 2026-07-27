import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { MaskReveal } from "@/components/ui/MaskReveal";

/**
 * Section header on the site's display scale: a micro mono label paired
 * with large, light-weight display type. The site is dark throughout, so
 * the old `dark` prop no longer branches -- it is kept only so existing
 * call sites don't break.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  index,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Optional section number, rendered alongside the eyebrow. */
  index?: string;
  /** @deprecated the site is always dark now. */
  dark?: boolean;
  className?: string;
}) {
  return (
    <AnimatedReveal
      y={0}
      className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}
    >
      {(eyebrow || index) && (
        <div
          className={cn(
            "label-micro mb-6 flex items-center gap-3 text-accent",
            align === "center" && "justify-center"
          )}
        >
          {index && (
            <>
              <span className="text-gray-500 tabular-nums">{index}</span>
              <span className="h-px w-6 bg-white/20" aria-hidden="true" />
            </>
          )}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      {/* Plain strings get the line-wipe reveal; richer nodes render as-is. */}
      {typeof title === "string" ? (
        <MaskReveal as="h2" text={title} className="display-lg text-balance text-chalk" />
      ) : (
        <h2 className="display-lg text-balance text-chalk">{title}</h2>
      )}

      {description && (
        <p
          className={cn(
            "text-balance mt-6 max-w-xl text-base text-gray-400 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedReveal>
  );
}
