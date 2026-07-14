"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { mainNav } from "@/data/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change. Adjusted during render (React's
  // documented pattern for resetting state when a prop changes) rather than
  // in an effect, which would cause an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mobileOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Container className="flex h-18 items-center justify-between py-4">
          <Link href="/" className="text-white">
            <Logo variant="light" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {mainNav.map((item) => (
              <AnimatedLink
                key={item.href}
                href={item.href}
                active={pathname === item.href}
                className="text-sm font-medium text-white/85 hover:text-white"
              >
                {item.label}
              </AnimatedLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/careers" variant="outline-light" size="sm">
              We&apos;re Hiring
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-full p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </Container>
      </header>

      {/*
        Rendered as a sibling of <header>, not a child: the header gains
        `backdrop-blur-xl` (a backdrop-filter) once `solid` is true, and a
        backdrop-filter on an ancestor establishes a new containing block
        for `position: fixed` descendants — which would shrink this
        full-viewport overlay down to the header's own height instead of
        filling the screen.
      */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
