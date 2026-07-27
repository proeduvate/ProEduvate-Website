export interface Reason {
  title: string;
  description: string;
  icon: "brain-circuit" | "users" | "gem" | "sparkles" | "layout-grid";
}

export const reasons: Reason[] = [
  {
    title: "AI-Native by Default",
    description:
      "We carry deep expertise in the latest AI stack, integrating it into your products and workflows to give your team a genuine edge — not automation for its own sake.",
    icon: "brain-circuit",
  },
  {
    title: "Experienced Team",
    description:
      "A team of experienced builders delivers your work at the time you need it, without cutting corners to get there.",
    icon: "users",
  },
  {
    title: "Quality First",
    description:
      "We hold every product to a high bar of quality, because that's what shows up in the experience your clients and users actually have.",
    icon: "gem",
  },
  {
    title: "A Gen Z Approach",
    description:
      "Our team brings a modern, trend-aware perspective that keeps your product feeling current in a fast-moving era.",
    icon: "sparkles",
  },
  {
    title: "Product-Minded Engineering",
    description:
      "Our product development team doesn't just build to spec — we identify gaps in your existing systems and help close them with the right features.",
    icon: "layout-grid",
  },
];
