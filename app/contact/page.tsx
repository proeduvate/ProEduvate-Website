import type { Metadata } from "next";
import { Mail, MapPin, Building2 } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { faqs } from "@/data/faqs";
import { address, emails, incubationCentres, socials } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ProEduvate for partnerships, careers, media, or general inquiries.",
};

// No phone number is published, by request.
const details = [
  ...emails.map((email) => ({
    icon: Mail,
    label: email.label,
    value: email.value,
    href: `mailto:${email.value}`,
  })),
  {
    icon: MapPin,
    label: "Office",
    value: address.lines.join(", "),
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.query)}`,
  },
];

const socialIcons = { LinkedIn: LinkedInIcon, Instagram: InstagramIcon } as const;
const social = socials.map((s) => ({
  ...s,
  icon: socialIcons[s.label as keyof typeof socialIcons],
}));

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation."
        description="Whether it's a partnership, a project, or a question about careers — we read every message."
      />

      <section className="bg-surface py-20 md:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedReveal>
            <ContactForm />
          </AnimatedReveal>

          <AnimatedReveal delay={0.1} className="space-y-8">
            <div className="space-y-5">
              {details.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-surface-2 p-5 transition-colors hover:border-accent/30"
                >
                  <detail.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm text-chalk">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface-2 p-5">
              <div className="flex items-start gap-4">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Incubation Centres
                  </p>
                  <ul className="mt-2 space-y-1">
                    {incubationCentres.map((centre) => (
                      <li key={centre} className="text-sm text-chalk">
                        {centre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-colors hover:border-accent hover:text-accent"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="bg-surface-2 py-20 md:py-28">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common questions." align="center" />
          <div className="mt-10">
            <Accordion items={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
