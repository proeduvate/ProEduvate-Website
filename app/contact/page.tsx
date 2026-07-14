import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { LinkedInIcon, XIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ProEduvate for partnerships, careers, media, or general inquiries.",
};

// STUB: placeholder contact details — replace with real address, phone,
// email, and social links before launch.
const details = [
  { icon: Mail, label: "Email", value: "hello@proeduvate.in", href: "mailto:hello@proeduvate.in" },
  { icon: Phone, label: "Phone", value: "+91 80 4567 8900", href: "tel:+918045678900" },
  {
    icon: MapPin,
    label: "Office",
    value: "4th Floor, Prestige Tech Park, Bengaluru, India",
    href: "#",
  },
];

const social = [
  { label: "LinkedIn", icon: LinkedInIcon, href: "#" },
  { label: "X / Twitter", icon: XIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation."
        description="Whether it's a partnership, a project, or a question about careers — we read every message."
      />

      <section className="bg-white py-20 md:py-28">
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
                  className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-off-white p-5 transition-colors hover:border-accent/30"
                >
                  <detail.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm text-black">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* TODO: static gradient placeholder stands in for a real embedded
                map until a confirmed office address is supplied. */}
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-2 to-black">
              <p className="text-sm text-white/70">Map placeholder — real address pending</p>
            </div>

            <div className="flex items-center gap-3">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-accent hover:text-accent"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="bg-off-white py-20 md:py-28">
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
