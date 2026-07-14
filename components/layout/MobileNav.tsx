"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/data/nav";
import { cn } from "@/lib/utils";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <Container className="flex h-18 items-center justify-between py-4">
            <span className="text-sm font-semibold tracking-wide text-white/60 uppercase">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full p-2 text-white"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </Container>

          <nav aria-label="Mobile" className="px-6">
            <ul className="flex flex-col gap-1">
              {mainNav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block border-b border-white/10 py-4 text-3xl font-display font-medium text-white/90 hover:text-accent-glow",
                      pathname === item.href && "text-accent-glow"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="absolute inset-x-0 bottom-10 px-6">
            <Button href="/careers" variant="primary" className="w-full">
              We&apos;re Hiring
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
