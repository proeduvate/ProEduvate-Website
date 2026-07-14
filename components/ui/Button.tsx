"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "md" | "lg" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-2 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--color-accent)] active:translate-y-0",
  secondary:
    "bg-white text-black hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)] active:translate-y-0",
  ghost:
    "bg-transparent text-current hover:bg-gray-50 active:bg-gray-200/60",
  "outline-light":
    "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", className, children, ...props }, ref) {
    const classes = cn(base, variants[variant], sizes[size], className);

    if ("href" in props && props.href) {
      const { href, ...rest } = props as ButtonAsLink;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    const rest = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...rest}>
        {children}
      </button>
    );
  }
);
