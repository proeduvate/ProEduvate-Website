"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { address, emails, socials } from "@/data/contact";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Internships", href: "/internships" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialIcons = { LinkedIn: LinkedInIcon, Instagram: InstagramIcon } as const;
const socialLinks = socials.map((s) => ({
  ...s,
  icon: socialIcons[s.label as keyof typeof socialIcons],
}));

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              We build AI-powered products for education and enterprise, and
              partner with clients who need the same craft applied to their own
              software.
            </p>

            <form
              className="mt-6 flex max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: no newsletter backend wired up yet, client-side stub only.
                setSubscribed(true);
              }}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-accent"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent p-2.5 text-white transition-colors hover:bg-accent-2"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500" aria-live="polite">
              {subscribed ? "Thanks — you're on the list." : "Occasional product & hiring updates."}
            </p>

            <address className="mt-8 space-y-1 text-sm not-italic text-gray-400">
              {address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <ul className="mt-4 space-y-1.5">
              {emails.map((email) => (
                <li key={email.value}>
                  <a
                    href={`mailto:${email.value}`}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {email.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/products" className="text-sm text-gray-300 hover:text-white">
                  All Products
                </Link>
              </li>
              {products.slice(0, 4).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={product.externalUrl}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link href="/services" className="text-sm text-gray-300 hover:text-white">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ProEduvate. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-white/40 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
