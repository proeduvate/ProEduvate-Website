// STUB: replace with real client/partner testimonials before launch.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  org: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "LearnSphere replaced three disconnected tools overnight. Our faculty actually enjoy using it, which says a lot.",
    name: "Dr. Priya Menon",
    role: "Dean of Academics",
    org: "Meridian Institute of Technology",
    initials: "PM",
  },
  {
    quote:
      "ProEduvate's team shipped our internal analytics platform faster than our own roadmap assumed possible, without cutting corners.",
    name: "James Okafor",
    role: "VP of Engineering",
    org: "Northbridge Systems",
    initials: "JO",
  },
  {
    quote:
      "Tutorly AI's adaptive assessment engine gave us a genuinely personalized view of every student, not just another dashboard.",
    name: "Lakshmi Subramanian",
    role: "Head of EdTech Programs",
    org: "Horizon Learning Trust",
    initials: "LS",
  },
];
