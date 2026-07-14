import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegalContent } from "@/components/sections/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ProEduvate collects, uses, and protects your data.",
};

// STUB: placeholder legal copy — have counsel review before launch.
const sections = [
  {
    heading: "Overview",
    body: [
      "This Privacy Policy describes how ProEduvate (\"we\", \"us\") collects, uses, and shares information when you use our website, products, and services.",
    ],
  },
  {
    heading: "Information We Collect",
    body: [
      "We collect information you provide directly, such as when you fill out a contact form or job application, including your name, email, phone number, and any files you upload.",
      "We also collect limited usage data (such as pages visited) to help us improve the site.",
    ],
  },
  {
    heading: "How We Use Information",
    body: [
      "We use the information we collect to respond to inquiries, process job applications, operate our products, and improve our services. We do not sell personal information to third parties.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "We retain application and contact data only as long as necessary for recruitment or business purposes, or as required by law.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to, correction of, or deletion of your personal data by contacting us at privacy@proeduvate.in.",
    ],
  },
  {
    heading: "Contact",
    body: ["Questions about this policy can be sent to privacy@proeduvate.in."],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <LegalContent lastUpdated="July 14, 2026" sections={sections} />
    </>
  );
}
