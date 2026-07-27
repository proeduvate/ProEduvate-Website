// `externalUrl` intentionally defaults to a local stub route ("#") so it is
// a one-line change to point at the future dedicated portfolio site.
// No `metric`/`sparkline` data is set on any product below -- these are
// real, named ProEduvate products, so we don't fabricate usage numbers for
// them the way the earlier placeholder demo set had.

export type ProductCategory = "EdTech" | "IT & Enterprise" | "AI";
export type ProductStatus = "Live" | "Beta" | "Coming Soon";

export interface ProductMetric {
  value: string;
  label: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  status: ProductStatus;
  initials: string;
  externalUrl: string;
  metric?: ProductMetric;
  sparkline?: number[];
}

export const products: Product[] = [
  {
    slug: "hackathon-portal",
    name: "Hackathon Portal",
    tagline: "Running and managing ProEduvate's hackathons end to end.",
    category: "EdTech",
    status: "Beta",
    initials: "HP",
    externalUrl: "#",
  },
  {
    slug: "testing-portal",
    name: "Testing Portal",
    tagline: "Centralized QA and testing workflows for our product line.",
    category: "IT & Enterprise",
    status: "Live",
    initials: "TP",
    externalUrl: "#",
  },
  {
    slug: "internship-portal",
    name: "Internship Portal",
    tagline: "Applications, tracking, and onboarding for interns in one place.",
    category: "EdTech",
    status: "Beta",
    initials: "IP",
    externalUrl: "#",
  },
  {
    slug: "mom-tool",
    name: "MoM Tool",
    tagline: "Turns meeting notes into clean, shareable minutes automatically.",
    category: "IT & Enterprise",
    status: "Beta",
    initials: "MT",
    externalUrl: "#",
  },
  {
    slug: "codoai",
    name: "CodoAI",
    tagline: "An AI pair-programmer for faster, cleaner code reviews.",
    category: "AI",
    status: "Live",
    initials: "CA",
    externalUrl: "#",
  },
  {
    slug: "lms-portal",
    name: "LMS Portal",
    tagline: "A learning management system, built the ProEduvate way.",
    category: "EdTech",
    status: "Beta",
    initials: "LP",
    externalUrl: "#",
  },
  {
    slug: "crictator",
    name: "Crictator",
    tagline: "Live cricket scoring and stats, built for fans.",
    category: "IT & Enterprise",
    status: "Coming Soon",
    initials: "CR",
    externalUrl: "#",
  },
  {
    slug: "medvault",
    name: "Medvault",
    tagline: "A secure digital vault for patient health records.",
    category: "IT & Enterprise",
    status: "Coming Soon",
    initials: "MV",
    externalUrl: "#",
  },
  {
    slug: "gdbot",
    name: "GDBot",
    tagline: "AI-moderated group discussion practice for interview prep.",
    category: "AI",
    status: "Beta",
    initials: "GD",
    externalUrl: "#",
  },
  {
    slug: "interview-bot",
    name: "Interview Bot",
    tagline: "AI mock interviews with real-time feedback.",
    category: "AI",
    status: "Beta",
    initials: "IB",
    externalUrl: "#",
  },
  {
    slug: "voltvision",
    name: "VoltVision",
    tagline: "Computer-vision monitoring for electrical infrastructure.",
    category: "AI",
    status: "Coming Soon",
    initials: "VV",
    externalUrl: "#",
  },
  {
    slug: "varalaru-ulagam",
    name: "Varalaru Ulagam",
    tagline: "A Tamil-language history learning experience.",
    category: "EdTech",
    status: "Coming Soon",
    initials: "VU",
    externalUrl: "#",
  },
  {
    slug: "soft-skills-portal",
    name: "Soft Skills Portal",
    tagline: "Structured soft-skills training and assessment.",
    category: "EdTech",
    status: "Beta",
    initials: "SS",
    externalUrl: "#",
  },
  {
    slug: "clinic-management-system",
    name: "Clinic Management System",
    tagline: "Appointments, records, and billing for clinics.",
    category: "IT & Enterprise",
    status: "Beta",
    initials: "CM",
    externalUrl: "#",
  },
  {
    slug: "camseye",
    name: "CamsEye",
    tagline: "AI-powered camera monitoring and alerts.",
    category: "AI",
    status: "Coming Soon",
    initials: "CE",
    externalUrl: "#",
  },
  {
    slug: "promtogen",
    name: "PromptoGen",
    tagline: "Generates and refines prompts for any LLM workflow.",
    category: "AI",
    status: "Live",
    initials: "PG",
    externalUrl: "#",
  },
];
