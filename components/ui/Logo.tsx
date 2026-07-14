import { cn } from "@/lib/utils";

/**
 * STUB: Wordmark placeholder standing in for the real ProEduvate logo file.
 * The brand logo was supplied as a pasted image, not a file this build could
 * save to disk, so it could not be dropped in as a static asset. Replace
 * this component's contents with an <Image src="/brand/logo.svg" /> (or an
 * inline SVG of the real mark) once the logo file is added to /public/brand.
 * The mark below is a simple geometric stand-in in the brand blue so layout
 * and spacing are already correct for the swap.
 */
export function Logo({
  className,
  variant = "auto",
}: {
  className?: string;
  variant?: "auto" | "light" | "dark";
}) {
  const wordColor =
    variant === "light" ? "text-white" : variant === "dark" ? "text-black" : "text-current";

  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M4 20L16 4L24 4L13 18.5L24 18.5L10 26L13 15.5L4 20Z" fill="var(--color-accent)" />
      </svg>
      <span className={cn("text-lg font-semibold tracking-tight", wordColor)}>
        Pro<span className="text-accent">Eduvate</span>
      </span>
    </span>
  );
}
