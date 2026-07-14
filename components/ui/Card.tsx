import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-6 transition-all duration-300",
        dark
          ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
          : "border-gray-200 bg-white hover:border-accent/30 hover:shadow-[0_20px_60px_-24px_rgba(20,113,240,0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
}
