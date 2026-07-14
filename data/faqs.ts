export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Does ProEduvate only work with schools and universities?",
    answer:
      "No. We build our own EdTech products for institutions, but our services arm also builds custom AI and enterprise software for clients well outside education.",
  },
  {
    question: "Can I see full product details or a live demo?",
    answer:
      "Our product pages here are intentionally a minimal overview. Full product detail, demos, and documentation live on our dedicated product portfolio site, linked from each product card.",
  },
  {
    question: "Do you offer part-time or internship roles?",
    answer:
      "Yes — we hire full-time, part-time, and internship roles year-round. Check the Careers and Internships pages for current openings and filters by employment type.",
  },
  {
    question: "How do you handle client data and AI models?",
    answer:
      "Client data stays isolated per engagement, and we're explicit up front about which AI providers or self-hosted models a project uses. Details are scoped per contract.",
  },
];
