import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegalContent } from "@/components/sections/LegalContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the ProEduvate website and products.",
};

// STUB: placeholder legal copy — have counsel review before launch.
const sections = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using the ProEduvate website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.",
    ],
  },
  {
    heading: "Use of the Site",
    body: [
      "This site is provided for informational purposes about ProEduvate's products, services, and career opportunities. You agree not to misuse the site or attempt to access it using automated means beyond normal browsing.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All content on this site, including text, graphics, logos, and product names, is the property of ProEduvate or its licensors and may not be used without permission.",
    ],
  },
  {
    heading: "Job Applications",
    body: [
      "Submitting a job or internship application through this site does not guarantee an interview or offer of employment.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "ProEduvate is not liable for any indirect or consequential damages arising from your use of this site, to the fullest extent permitted by law.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: ["We may update these terms from time to time; continued use of the site constitutes acceptance of the updated terms."],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <LegalContent lastUpdated="July 14, 2026" sections={sections} />
    </>
  );
}
