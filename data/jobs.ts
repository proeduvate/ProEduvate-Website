// STUB: replace with real open roles before launch. See /data/README.md.
import type { JobListing } from "./types";

export const jobs: JobListing[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    employmentType: "full-time",
    location: "Bengaluru, India",
    locationType: "Hybrid",
    postedAt: "2026-06-18",
    summary:
      "Build and ship features across our EdTech product line, working closely with design and AI/ML to bring new learning experiences to production.",
    responsibilities: [
      "Own features end-to-end across our Next.js/Node stack",
      "Collaborate with product and design on technical feasibility",
      "Write maintainable, well-tested code and review peers' PRs",
      "Mentor junior engineers and contribute to engineering standards",
    ],
    requirements: [
      "4+ years building production web applications",
      "Strong TypeScript, React, and Node.js experience",
      "Comfort working with relational databases at scale",
      "Clear written communication for a remote-friendly team",
    ],
    niceToHave: ["Experience in EdTech or LMS platforms", "Exposure to LLM-integrated products"],
  },
  {
    id: "ml-engineer-edtech",
    title: "ML Engineer, Adaptive Learning",
    department: "AI/ML",
    employmentType: "full-time",
    location: "Remote (India)",
    locationType: "Remote",
    postedAt: "2026-06-10",
    summary:
      "Design and improve the models behind Tutorly AI's adaptive assessment and tutoring engine.",
    responsibilities: [
      "Develop and evaluate models for adaptive assessment",
      "Build evaluation harnesses for tutoring quality and safety",
      "Partner with content teams to encode pedagogy into model behavior",
      "Ship improvements into production with clear rollback plans",
    ],
    requirements: [
      "3+ years in applied ML or NLP",
      "Experience with LLM fine-tuning, prompting, or RAG pipelines",
      "Solid Python engineering fundamentals",
      "Genuine interest in education outcomes, not just model metrics",
    ],
    niceToHave: ["Published research or open-source ML contributions"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    employmentType: "full-time",
    location: "Bengaluru, India",
    locationType: "Hybrid",
    postedAt: "2026-05-29",
    summary:
      "Shape the design system and end-to-end product experience across ProEduvate's EdTech and enterprise product lines.",
    responsibilities: [
      "Lead design for 1-2 core products from research to shipped UI",
      "Maintain and evolve our shared design system",
      "Run lightweight usability studies with real users",
      "Partner closely with engineering on implementation fidelity",
    ],
    requirements: [
      "3+ years of product design experience, portfolio required",
      "Fluency in Figma and modern design systems practice",
      "Experience designing for complex, data-dense interfaces",
    ],
  },
  {
    id: "part-time-content-strategist",
    title: "EdTech Content Strategist (Part-Time)",
    department: "EdTech Content",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-06-22",
    summary:
      "Shape instructional content and assessment frameworks across our learning products, roughly 20 hours a week.",
    responsibilities: [
      "Develop instructional content aligned to curriculum standards",
      "Review AI-generated learning content for pedagogical soundness",
      "Collaborate with product on content-related feature requests",
    ],
    requirements: [
      "Background in instructional design or curriculum development",
      "Comfortable giving structured feedback on AI-generated drafts",
      "Available ~20 hrs/week with flexible scheduling",
    ],
  },
  {
    id: "part-time-marketing-associate",
    title: "Marketing Associate (Part-Time)",
    department: "Marketing",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-06-05",
    summary:
      "Support content, social, and campaign execution for ProEduvate's product and employer brand marketing.",
    responsibilities: [
      "Draft and schedule social and blog content",
      "Support campaign reporting and light analytics",
      "Coordinate with design on marketing assets",
    ],
    requirements: [
      "1-2 years marketing or content experience",
      "Strong written English and attention to detail",
      "Available 15-20 hrs/week",
    ],
  },
  {
    id: "part-time-qa-analyst",
    title: "QA Analyst (Part-Time)",
    department: "Engineering",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-05-14",
    summary:
      "Help keep our product releases reliable through structured manual and light automated testing.",
    responsibilities: [
      "Execute test plans across web and mobile product surfaces",
      "Log, triage, and verify bug fixes with engineering",
      "Contribute to automated regression test coverage over time",
    ],
    requirements: [
      "1+ years in QA or a related testing role",
      "Comfortable working async with a distributed engineering team",
      "Available 15-20 hrs/week",
    ],
  },
];
