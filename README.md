# ProEduvate Website

Marketing website for ProEduvate — an AI-powered product company building
across EdTech and IT/enterprise software. Built with Next.js (App Router),
TypeScript, Tailwind CSS v4, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** — design tokens live in `app/globals.css` (`:root` /
  `@theme inline`), not a `tailwind.config.ts`, which is how Tailwind v4
  handles theming
- **Framer Motion** for scroll reveals and micro-interactions
  (`prefers-reduced-motion` aware)
- **React Hook Form + Zod** for the Contact and application forms
- **lucide-react** for icons

## Structure

- `app/` — routes (App Router)
- `components/ui/` — shared primitives (Button, Card, Badge, Accordion, ...)
- `components/sections/` — page sections (Hero, ProductsGrid, JobCard, ...)
- `components/layout/` — Navbar, MobileNav, Footer
- `data/` — all site content as typed arrays/objects. **See `data/README.md`
  for the full pre-launch content checklist** — every stub in this project
  (products, jobs, team, stats, logo, colors, etc.) is tracked there.

## Before Launch

Read `data/README.md`. In short: the logo is a placeholder (the real file
was never available to save to disk — see `components/ui/Logo.tsx`), the
color palette is a best-effort visual read of the logo, and all company
data (products, jobs, team, testimonials, address) is realistic but
fictional stub content.
