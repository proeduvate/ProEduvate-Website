// STUB: replace with real product data before launch. See /data/README.md.
// `externalUrl` intentionally defaults to a local stub route ("#" or
// `/products#slug`) so it is a one-line change to point at the future
// dedicated portfolio site (e.g. `https://portfolio.proeduvate.in/[slug]`).

export type ProductCategory = "EdTech" | "IT & Enterprise" | "AI";
export type ProductStatus = "Live" | "Beta" | "Coming Soon";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  status: ProductStatus;
  initials: string;
  externalUrl: string;
}

export const products: Product[] = [
  {
    slug: "learnsphere",
    name: "LearnSphere",
    tagline: "A modern LMS for institutions that outgrew spreadsheets.",
    category: "EdTech",
    status: "Live",
    initials: "LS",
    externalUrl: "#",
  },
  {
    slug: "tutorly-ai",
    name: "Tutorly AI",
    tagline: "AI tutoring and adaptive assessment for every learner.",
    category: "EdTech",
    status: "Live",
    initials: "TA",
    externalUrl: "#",
  },
  {
    slug: "campusos",
    name: "CampusOS",
    tagline: "Campus management, unified — admissions to alumni.",
    category: "EdTech",
    status: "Beta",
    initials: "CO",
    externalUrl: "#",
  },
  {
    slug: "credentia",
    name: "Credentia",
    tagline: "Skill certification and verifiable digital credentials.",
    category: "EdTech",
    status: "Coming Soon",
    initials: "CR",
    externalUrl: "#",
  },
  {
    slug: "flowforge",
    name: "FlowForge",
    tagline: "AI workflow automation for operations teams.",
    category: "IT & Enterprise",
    status: "Live",
    initials: "FF",
    externalUrl: "#",
  },
  {
    slug: "pulseboard",
    name: "PulseBoard",
    tagline: "Real-time analytics dashboards for data-driven teams.",
    category: "IT & Enterprise",
    status: "Live",
    initials: "PB",
    externalUrl: "#",
  },
  {
    slug: "devrail",
    name: "DevRail",
    tagline: "Developer tooling and internal SaaS scaffolding, faster.",
    category: "IT & Enterprise",
    status: "Beta",
    initials: "DR",
    externalUrl: "#",
  },
  {
    slug: "assistiq",
    name: "AssistIQ",
    tagline: "Enterprise-grade AI chatbot and agent platform.",
    category: "AI",
    status: "Beta",
    initials: "AQ",
    externalUrl: "#",
  },
];
