import { cn } from "@/lib/utils";

/**
 * Dark surface panel. The site runs near-black end to end, so there is no
 * light variant -- the `dark` prop is kept only so existing call sites
 * don't break, and has no effect.
 */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  /** @deprecated the card is always dark now. */
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300",
        "hover:border-white/20 hover:bg-white/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}
