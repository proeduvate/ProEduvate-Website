"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function AnimatedLink({
  href,
  children,
  className,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-block py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
        active && "after:scale-x-100",
        className
      )}
    >
      {children}
    </Link>
  );
}
