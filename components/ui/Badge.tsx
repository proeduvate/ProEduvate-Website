import { cn } from "@/lib/utils";

type Tone = "accent" | "neutral" | "success" | "warning" | "outline";

const tones: Record<Tone, string> = {
  accent: "bg-accent/15 text-accent-2",
  neutral: "bg-gray-50 text-gray-800",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  outline: "border border-white/25 text-white",
};

export function Badge({
  children,
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
