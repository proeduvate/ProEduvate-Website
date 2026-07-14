export interface Benefit {
  title: string;
  description: string;
  icon: "clock" | "book-open" | "heart-pulse" | "trending-up" | "home" | "users";
}

export const benefits: Benefit[] = [
  {
    title: "Flexible Work",
    description: "Async-friendly hours built around deep work, not seat time.",
    icon: "clock",
  },
  {
    title: "Learning Budget",
    description: "Annual budget for courses, books, and conferences.",
    icon: "book-open",
  },
  {
    title: "Health Coverage",
    description: "Comprehensive health insurance for you and your family.",
    icon: "heart-pulse",
  },
  {
    title: "Growth Path",
    description: "Clear leveling and mentorship from day one.",
    icon: "trending-up",
  },
  {
    title: "Remote-Friendly",
    description: "Hybrid and fully remote roles across most departments.",
    icon: "home",
  },
  {
    title: "Team Culture",
    description: "Small, high-trust teams that ship together and celebrate together.",
    icon: "users",
  },
];

export const internshipGains: string[] = [
  "Real product experience on shipped features, not busywork",
  "Direct mentorship from senior engineers, designers, and researchers",
  "A completion certificate and structured feedback",
  "Strong potential path to a full-time offer",
  "Portfolio-worthy work you can show future employers",
];

export interface InternshipTrack {
  name: string;
  description: string;
  icon: "brain-circuit" | "code-2" | "palette" | "graduation-cap" | "megaphone" | "bar-chart-3";
}

export const internshipTracks: InternshipTrack[] = [
  {
    name: "AI/ML Engineering",
    description: "Work on the models and pipelines behind our adaptive learning products.",
    icon: "brain-circuit",
  },
  {
    name: "Full-Stack Development",
    description: "Ship real features across our EdTech and enterprise product lines.",
    icon: "code-2",
  },
  {
    name: "Product Design (UI/UX)",
    description: "Research, wireframe, and design real product surfaces end-to-end.",
    icon: "palette",
  },
  {
    name: "EdTech Content & Instructional Design",
    description: "Shape curriculum-aligned content and assessment frameworks.",
    icon: "graduation-cap",
  },
  {
    name: "Digital Marketing",
    description: "Support content, campaigns, and growth across our channels.",
    icon: "megaphone",
  },
  {
    name: "Data Science",
    description: "Explore product and learning data to surface real insights.",
    icon: "bar-chart-3",
  },
];
