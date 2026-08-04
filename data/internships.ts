/*
 * Open internship tracks at ProEduvate.
 *
 * Tracks, format (remote), duration (3 or 6 months) and compensation (paid or
 * unpaid depending on the cohort) are as supplied by the company. The
 * summary/responsibilities/requirements are drafted from the track names and
 * should be reviewed before launch.
 */
import type { InternshipListing } from "./types";

const COMMON = {
  location: "Remote",
  locationType: "Remote" as const,
  duration: "3 or 6 months",
  stipend: "Paid or unpaid, depending on cohort",
  postedAt: "2026-08-01",
};

export const internships: InternshipListing[] = [
  {
    ...COMMON,
    id: "ai-ml-intern",
    title: "AI/ML Intern",
    track: "AI & Machine Learning",
    summary:
      "Work with the AI team on the models and pipelines behind our products, from prompt design through evaluation.",
    responsibilities: [
      "Build and evaluate prompts, pipelines, and retrieval steps",
      "Curate evaluation sets and record experiment results",
      "Support taking a model change from notebook to production",
    ],
    requirements: [
      "Working knowledge of Python and core ML concepts",
      "Curiosity about applied AI rather than benchmarks alone",
    ],
  },
  {
    ...COMMON,
    id: "full-stack-intern",
    title: "Full Stack Intern",
    track: "Full Stack Development",
    summary:
      "Ship real features across our web products, front to back, under senior engineer review.",
    responsibilities: [
      "Build UI components and the API endpoints behind them",
      "Write tests for the features you ship",
      "Take part in code review and team standups",
    ],
    requirements: [
      "Comfortable with JavaScript/TypeScript and React",
      "Some exposure to a backend runtime and a database",
    ],
  },
  {
    ...COMMON,
    id: "backend-intern",
    title: "Backend Intern",
    track: "Backend Development",
    summary:
      "Work on the services, data models, and integrations our products run on.",
    responsibilities: [
      "Implement and document API endpoints",
      "Model data and write queries that hold up under load",
      "Help with integrations to third-party services",
    ],
    requirements: [
      "Familiar with at least one backend language and SQL",
      "Interested in correctness and clear error handling",
    ],
  },
  {
    ...COMMON,
    id: "product-development-intern",
    title: "Product Development Intern",
    track: "Product Development",
    summary:
      "Sit between users and engineering — scoping what gets built, and checking it did what it was meant to.",
    responsibilities: [
      "Write up requirements and acceptance criteria",
      "Run lightweight user feedback sessions",
      "Track what shipped against what was scoped",
    ],
    requirements: [
      "Clear written communication",
      "Comfortable asking questions until a problem is actually understood",
    ],
  },
  {
    ...COMMON,
    id: "digital-marketing-intern",
    title: "Digital Marketing Intern",
    track: "Digital Marketing",
    summary:
      "Support campaigns, content, and reporting across ProEduvate's product and employer brand.",
    responsibilities: [
      "Draft and schedule campaign and blog content",
      "Support reporting on reach and engagement",
      "Coordinate with design on marketing assets",
    ],
    requirements: [
      "Strong written English and attention to detail",
      "Interest in how technical work gets explained to a non-technical audience",
    ],
  },
  {
    ...COMMON,
    id: "social-media-intern",
    title: "Social Media Intern",
    track: "Social Media",
    summary:
      "Run the day-to-day of ProEduvate's social presence and grow the community around what we build.",
    responsibilities: [
      "Plan and publish a regular content calendar",
      "Write copy that suits each platform rather than reposting one draft everywhere",
      "Track what lands and feed it back into the next cycle",
    ],
    requirements: [
      "Familiar with LinkedIn and Instagram as a publisher, not just a user",
      "Comfortable writing in a consistent brand voice",
    ],
  },
  {
    ...COMMON,
    id: "hr-intern",
    title: "HR Intern",
    track: "Human Resource",
    summary:
      "Support hiring and people operations across our internship cohorts and core team.",
    responsibilities: [
      "Screen applications and schedule interviews",
      "Support onboarding for new joiners",
      "Keep cohort records and documentation current",
    ],
    requirements: [
      "Interest in people operations and early-stage hiring",
      "Discreet with confidential information",
    ],
  },
];
