// `externalUrl` intentionally defaults to a local stub route ("#") so it is
// a one-line change to point at the future dedicated portfolio site.
// No `metric`/`sparkline` data is set on any product -- these are real,
// named ProEduvate products, so we don't fabricate usage numbers for them.

export type ProductCategory = "EdTech" | "IT & Enterprise" | "AI";
export type ProductStatus = "Live" | "Beta" | "Coming Soon";

export interface ProductMetric {
  value: string;
  label: string;
}

export interface Product {
  slug: string;
  /**
   * Real UI screenshot, where one exists. Only a few products have been
   * supplied so far; the rest fall back to generated glyph art.
   */
  screenshot?: string;
  name: string;
  /** One-line summary, used in the homepage preview cards. */
  tagline: string;
  /** Fuller description, used on the /products story panels. */
  description: string;
  /** Optional feature bullets shown alongside the description. */
  highlights?: string[];
  category: ProductCategory;
  status: ProductStatus;
  initials: string;
  externalUrl: string;
  metric?: ProductMetric;
  sparkline?: number[];
}

export const products: Product[] = [
  {
    slug: "hackzen",
    screenshot: "/products/ui/hackzen.webp",
    name: "HackZen",
    tagline: "A hackathon platform built to stretch young innovators.",
    description:
      "HackZen is where hackathons get run — bringing young minds together around genuinely challenging problem statements.",
    highlights: [
      "Students take part in live hackathons",
      "Organisations host their own events on the platform",
      "A personalised AI assistant sharpens problem statements and development direction",
      "Mentors track and guide their teams' progress",
    ],
    category: "EdTech",
    status: "Beta",
    initials: "HZ",
    externalUrl: "#",
  },
  {
    slug: "testsync",
    screenshot: "/products/ui/testsync.webp",
    name: "TestSync",
    tagline: "Real-time user testing for developers and startups.",
    description:
      "TestSync connects developers and startups with real users for live testing in whichever area they need — and testers get paid for the sessions they run.",
    category: "IT & Enterprise",
    status: "Live",
    initials: "TS",
    externalUrl: "#",
  },
  {
    slug: "prointern",
    name: "ProIntern",
    tagline: "A one-month internship on a real project, assessed by AI.",
    description:
      "ProIntern places students inside a real project module for a one-month internship, with their learning and performance evaluated by AI.",
    category: "EdTech",
    status: "Beta",
    initials: "PI",
    externalUrl: "#",
  },
  {
    slug: "minanalyzer",
    name: "MinAnalyzer",
    tagline: "Records, summarises, and pulls insight out of every meeting.",
    description:
      "MinAnalyzer records online meetings, summarises them into clean minutes, and surfaces the insights worth acting on.",
    category: "IT & Enterprise",
    status: "Beta",
    initials: "MA",
    externalUrl: "#",
  },
  {
    slug: "codoai",
    screenshot: "/products/ui/codoai.webp",
    name: "CodoAI",
    tagline: "Gamified coding practice with an AI guide in real time.",
    description:
      "CodoAI is a coding practice platform with a gamified, Gen Z feel — and an AI assistant guiding you live as you write code.",
    category: "EdTech",
    status: "Live",
    initials: "CA",
    externalUrl: "#",
  },
  {
    slug: "learnova",
    name: "Learnova",
    tagline: "A personal learning portal built around placement prep.",
    description:
      "Learnova is a personal learning portal where individuals study and prepare themselves for placements.",
    category: "EdTech",
    status: "Beta",
    initials: "LN",
    externalUrl: "#",
  },
  {
    slug: "crictator",
    name: "Crictator",
    tagline: "Cricket simulation with realistic player and pitch modelling.",
    description:
      "Crictator simulates cricket matches under realistic conditions, with a live player model covering physical fitness, mindset, pitch conditions and more.",
    category: "IT & Enterprise",
    status: "Coming Soon",
    initials: "CR",
    externalUrl: "#",
  },
  {
    slug: "medvault",
    name: "Medvault",
    tagline: "E-card medical records for emergencies and new consultations.",
    description:
      "Medvault stores a person's medical record on an e-card, ready for an emergency or a first visit to a new doctor.",
    category: "IT & Enterprise",
    status: "Coming Soon",
    initials: "MV",
    externalUrl: "#",
  },
  {
    slug: "gd-bot",
    name: "GD Bot",
    tagline: "Practise group discussions against AI, then get the analytics.",
    description:
      "GD Bot is an AI-based group discussion platform where individuals practise and compete against AI, then get a report on exactly where to improve.",
    category: "AI",
    status: "Beta",
    initials: "GD",
    externalUrl: "#",
  },
  {
    slug: "tailon-ai",
    name: "Tailon AI",
    tagline: "AI interview rounds to practise on before the real thing.",
    description:
      "Tailon AI is an AI-based interview practice platform for anyone working through interview preparation.",
    category: "AI",
    status: "Beta",
    initials: "TA",
    externalUrl: "#",
  },
  {
    slug: "voltvision",
    name: "Voltvision",
    tagline: "Drone software that cuts energy waste in industrial zones.",
    description:
      "Voltvision is a drone-based software solution for reducing energy wastage across industrial zones, running alerts 24/7.",
    category: "AI",
    status: "Coming Soon",
    initials: "VV",
    externalUrl: "#",
  },
  {
    slug: "varalaru-ulagam",
    name: "Varalaru Ulagam",
    tagline: "XR heritage preservation with an AI tour guide.",
    description:
      "Varalaru Ulagam is an XR solution for preserving heritage sites and promoting tourism, with an AI historic tour guide accompanying visitors.",
    category: "AI",
    status: "Coming Soon",
    initials: "VU",
    externalUrl: "#",
  },
  {
    slug: "soft-skills-portal",
    name: "Soft Skills Portal",
    tagline: "Soft skills training through AI scenarios and questioning.",
    description:
      "The Soft Skills Portal builds individual soft skills through AI-driven scenario justification and questionnaires.",
    category: "EdTech",
    status: "Beta",
    initials: "SS",
    externalUrl: "#",
  },
  {
    slug: "cms",
    name: "Clinic Management System",
    tagline: "Clinic management, organised the way doctors actually work.",
    description:
      "CMS is a management portal that gives doctors an efficient view of how their clinic is running, in a doctor's own terms.",
    category: "IT & Enterprise",
    status: "Beta",
    initials: "CM",
    externalUrl: "#",
  },
  {
    slug: "camseye",
    name: "CamsEye",
    tagline: "CCTV monitoring with advanced analytics and detection reports.",
    description:
      "CamsEye monitors and detects across CCTV camera feeds, with advanced analytics and detection reporting.",
    category: "AI",
    status: "Coming Soon",
    initials: "CE",
    externalUrl: "#",
  },
  {
    slug: "promptogen",
    screenshot: "/products/ui/promptogen.webp",
    name: "PromptoGen",
    tagline: "Turns plain text or an image into a proper prompt.",
    description:
      "PromptoGen is an advanced AI tool that converts an ordinary text message into a real prompt, and an image into a detailed one.",
    category: "AI",
    status: "Live",
    initials: "PG",
    externalUrl: "#",
  },
  {
    slug: "research-hub",
    name: "Research Hub",
    tagline: "Research tools and converters for sharper insight.",
    description:
      "Research Hub gathers a range of research tools and converters in one place, for better insights and a clearer research direction.",
    category: "AI",
    // NOTE: no build status was supplied for this one -- defaulted to
    // "Coming Soon". Confirm before launch.
    status: "Coming Soon",
    initials: "RH",
    externalUrl: "#",
  },
];

/**
 * Live first, then Beta, then Coming Soon.
 *
 * Used by the products page so shipped work leads and unreleased work sits
 * at the end. `sort` is stable, so the authored order is preserved within
 * each status group. The unsorted `products` export is left as-is for
 * places that want the original ordering.
 */
const STATUS_ORDER: Record<ProductStatus, number> = {
  Live: 0,
  Beta: 1,
  "Coming Soon": 2,
};

export const productsByStatus: Product[] = [...products].sort(
  (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
);
