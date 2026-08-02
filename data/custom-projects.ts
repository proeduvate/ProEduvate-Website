export interface CustomProject {
  name: string;
  description: string;
  slug: string;
  /**
   * Cover art shown in the hover popup. Currently procedurally generated
   * placeholders from scripts/build-project-covers.mjs, not screenshots of
   * the real deliverables -- drop a real image in at the same path to swap.
   */
  image: string;
}

export const customProjects: CustomProject[] = [
  {
    name: "AI Seva",
    slug: "ai-seva",
    image: "/custom-projects/ai-seva.webp",
    description:
      "A custom government scheme app that recommends schemes and auto-fills the applications.",
  },
  {
    name: "Blood Detection",
    slug: "blood-detection",
    image: "/custom-projects/blood-detection.webp",
    description:
      "An AI agent-based blood detection and justification system, with mosquito-borne disease prediction.",
  },
  {
    name: "Nexus Company Website",
    slug: "nexus-company-website",
    image: "/custom-projects/nexus-company-website.webp",
    description: "A website built for a pest control company.",
  },
  {
    name: "Hospital Website",
    slug: "hospital-website",
    image: "/custom-projects/hospital-website.webp",
    description: "A hospital website scoped so each doctor sees only their own patients.",
  },
  {
    name: "CRM",
    slug: "crm",
    image: "/custom-projects/crm.webp",
    description: "A CRM built for a client company.",
  },
  {
    name: "AI Tender Summarizer",
    slug: "ai-tender-summarizer",
    image: "/custom-projects/ai-tender-summarizer.webp",
    description:
      "An AI-based tender document summarizer with question handling built in.",
  },
  {
    name: "Certificate Management Portal",
    slug: "certificate-management-portal",
    image: "/custom-projects/certificate-management-portal.webp",
    description: "A system for managing certificates and keeping certificate data current.",
  },
  {
    name: "Recruitment Chatbot",
    slug: "recruitment-chatbot",
    image: "/custom-projects/recruitment-chatbot.webp",
    description: "A chatbot that handles recruitment queries for an HR team.",
  },
  {
    name: "Appointment Booking Chatbot",
    slug: "appointment-booking-chatbot",
    image: "/custom-projects/appointment-booking-chatbot.webp",
    description: "An appointment booking chatbot for a doctor's clinic.",
  },
  {
    name: "Social Media App",
    slug: "social-media-app",
    image: "/custom-projects/social-media-app.webp",
    description: "A social media app built for an internal organisational requirement.",
  },
  {
    name: "Lead Generator",
    slug: "lead-generator",
    image: "/custom-projects/lead-generator.webp",
    description: "An AI-based lead generation tool for sourcing prospective clients.",
  },
];
