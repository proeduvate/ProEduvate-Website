import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import { team } from "@/data/team";

export function TeamGrid() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          title="The people steering ProEduvate."
          description="STUB: placeholder leadership profiles — real names, titles, bios, and headshots to be supplied before launch."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <AnimatedReveal key={member.name} className="h-full">
              <div className="h-full rounded-2xl border border-white/10 bg-surface-2 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-semibold text-accent">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-medium text-chalk">{member.name}</h3>
                <p className="text-sm text-accent">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{member.bio}</p>
                <a
                  href={member.linkedin}
                  aria-label={`${member.name} on LinkedIn`}
                  className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-colors hover:border-accent hover:text-accent"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
