// STUB: replace with real service offerings before launch. See /data/README.md.

export interface Service {
  slug: string;
  name: string;
  description: string;
  included: string[];
  icon:
    | "graduation-cap"
    | "brain-circuit"
    | "building-2"
    | "palette"
    | "cloud"
    | "database"
    | "compass";
}

export const services: Service[] = [
  {
    slug: "edtech-platforms",
    name: "Custom EdTech Platform Development",
    description:
      "End-to-end learning platforms built for scale — from LMS builds to full campus systems, tailored to how your institution actually teaches.",
    included: [
      "Learning management & content delivery",
      "Assessment and gradebook engines",
      "Student, faculty, and admin portals",
      "SIS / third-party integrations",
    ],
    icon: "graduation-cap",
  },
  {
    slug: "ai-ml-solutions",
    name: "AI/ML Solution Development",
    description:
      "LLM integrations, intelligent tutoring systems, and automation agents designed around your data and your workflows, not a generic wrapper.",
    included: [
      "LLM & RAG integration",
      "Intelligent tutoring & assessment models",
      "Workflow automation agents",
      "Model evaluation & guardrails",
    ],
    icon: "brain-circuit",
  },
  {
    slug: "enterprise-software",
    name: "Enterprise Software Development",
    description:
      "Custom internal tools and customer-facing platforms engineered for reliability, security, and the messy realities of enterprise scale.",
    included: [
      "Internal tooling & admin systems",
      "Customer-facing web applications",
      "Legacy system modernization",
      "API & systems integration",
    ],
    icon: "building-2",
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX & Product Design",
    description:
      "Research-backed product design that balances polish with usability, from early wireframes to a fully realized design system.",
    included: [
      "Product discovery & UX research",
      "Design systems & component libraries",
      "Interactive prototyping",
      "Accessibility audits",
    ],
    icon: "palette",
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps / Infrastructure",
    description:
      "Infrastructure that scales quietly in the background — CI/CD, observability, and cloud architecture built for uptime.",
    included: [
      "Cloud architecture & migration",
      "CI/CD pipeline design",
      "Observability & monitoring",
      "Cost optimization",
    ],
    icon: "cloud",
  },
  {
    slug: "data-engineering",
    name: "Data Engineering & Analytics",
    description:
      "Pipelines and dashboards that turn scattered institutional or product data into decisions your team can act on.",
    included: [
      "Data pipeline & warehouse design",
      "ETL/ELT engineering",
      "Analytics dashboards",
      "Reporting automation",
    ],
    icon: "database",
  },
  {
    slug: "digital-transformation",
    name: "Consulting & Digital Transformation",
    description:
      "Strategic advisory for institutions and enterprises modernizing how they teach, operate, or ship software.",
    included: [
      "Technology roadmapping",
      "Process & systems audits",
      "AI readiness assessments",
      "Change management support",
    ],
    icon: "compass",
  },
];
