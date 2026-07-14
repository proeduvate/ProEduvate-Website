export interface Value {
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: "lightbulb" | "gem" | "target" | "shield-check" | "hammer" | "zap";
}

export const values: Value[] = [
  {
    title: "Innovation",
    shortDescription: "We build what's next, not what's safe.",
    longDescription:
      "We treat AI as a foundation, not a feature bolt-on — pushing our products toward what learning and enterprise software could be, not just what's expected.",
    icon: "lightbulb",
  },
  {
    title: "Quality",
    shortDescription: "Craft over shortcuts, always.",
    longDescription:
      "Every product we ship carries our name. We hold our own IP and client work to the same bar: tested, accessible, and built to last past launch day.",
    icon: "gem",
  },
  {
    title: "Impact",
    shortDescription: "Outcomes over vanity metrics.",
    longDescription:
      "We measure success in learning outcomes and operational hours saved for our clients, not feature counts or engagement theater.",
    icon: "target",
  },
  {
    title: "Integrity",
    shortDescription: "Honest about what AI can and can't do.",
    longDescription:
      "We're transparent with clients, partners, and each other, especially about the limits of the AI systems we build. Trust compounds; hype doesn't.",
    icon: "shield-check",
  },
  {
    title: "Craft",
    shortDescription: "The details are the product.",
    longDescription:
      "From micro-interactions to data pipelines, we sweat the details that make software feel considered rather than assembled.",
    icon: "hammer",
  },
  {
    title: "Speed",
    shortDescription: "Momentum is a feature.",
    longDescription:
      "We ship in tight, reviewable increments so our products and our clients' projects keep moving without sacrificing quality.",
    icon: "zap",
  },
];
