// STUB: minimal-viable blog with 3 placeholder posts, per brief §9 (optional).

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: string;
  content: string[];
}

export const posts: BlogPost[] = [
  {
    slug: "adaptive-learning-beyond-the-hype",
    title: "Adaptive Learning Beyond the Hype",
    excerpt:
      "What actually changes for students and faculty when assessment adapts in real time, and what doesn't.",
    date: "2026-05-12",
    author: "Rahul Verma",
    readingTime: "6 min read",
    content: [
      "Adaptive learning has become one of those phrases that means everything and nothing. At ProEduvate, we've spent the last two years building it into Tutorly AI, and the honest answer is: it changes less than the marketing suggests, and more than the skeptics assume.",
      "The real shift isn't personalized content feeds. It's tighter feedback loops between what a student attempts and what they're shown next, measured in minutes instead of weeks.",
      "None of this replaces instructors. The institutions getting the most value treat adaptive assessment as a second set of eyes, not an autopilot.",
    ],
  },
  {
    slug: "what-enterprise-clients-actually-ask-for",
    title: "What Enterprise Clients Actually Ask For",
    excerpt: "Three years of client engagements, distilled into the requests that show up every time.",
    date: "2026-04-03",
    author: "Vikram Das",
    readingTime: "5 min read",
    content: [
      "Ask ten enterprise clients what they want from a software partner and you'll get ten different answers on the surface. Underneath, three requests show up almost every time: predictable delivery, honest scoping, and systems their own team can maintain after we leave.",
      "The projects that go well are the ones where we push back early on scope creep disguised as 'quick additions.'",
      "The projects that go badly are almost never a technology problem. They're a communication problem that shows up in the code six weeks later.",
    ],
  },
  {
    slug: "building-ai-products-institutions-trust",
    title: "Building AI Products Institutions Actually Trust",
    excerpt: "Trust in EdTech AI is earned through defaults, not disclaimers.",
    date: "2026-02-21",
    author: "Ananya Rao",
    readingTime: "7 min read",
    content: [
      "Every AI EdTech vendor says their product is 'transparent' and 'privacy-first.' Most of that is a disclaimer, not a design decision.",
      "We've found trust gets built in the defaults: what data is collected without being asked, what a teacher can override, and what happens when the model is uncertain.",
      "Institutions don't need AI that never makes mistakes. They need AI that's honest about when it might be wrong, and easy for a human to correct.",
    ],
  },
];
