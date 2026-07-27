import { cn } from "@/lib/utils";

/**
 * Corner brackets that frame a section, borrowed from the instrument/HUD
 * language established in the hero. Purely decorative.
 */
export function BracketFrame({
  className,
  inset = "inset-6",
  size = "h-8 w-8",
}: {
  className?: string;
  inset?: string;
  size?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute hidden md:block", inset, className)}
    >
      <span className={cn("absolute top-0 left-0 border-t border-l border-accent/40", size)} />
      <span className={cn("absolute top-0 right-0 border-t border-r border-accent/40", size)} />
      <span className={cn("absolute bottom-0 left-0 border-b border-l border-accent/40", size)} />
      <span className={cn("absolute right-0 bottom-0 border-b border-r border-accent/40", size)} />
    </div>
  );
}
