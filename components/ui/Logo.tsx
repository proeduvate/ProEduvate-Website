import Image from "next/image";
import { cn } from "@/lib/utils";

// Real brand mark, sourced from public/brand/logo-full.png -- the full
// lockup (icon + wordmark + "people. projects and potential" caption). White
// text is baked into the asset, so it only reads correctly on dark
// backgrounds -- which is every place this component is currently used.
// Taller than a typical nav logo so the caption stays legible.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/logo-full.png"
        alt="ProEduvate — people. projects and potential"
        width={3234}
        height={900}
        priority
        className="h-10 w-auto sm:h-12"
      />
    </span>
  );
}
