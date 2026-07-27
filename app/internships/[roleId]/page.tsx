import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, CalendarDays, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { internships } from "@/data/internships";

export function generateStaticParams() {
  return internships.map((role) => ({ roleId: role.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roleId: string }>;
}): Promise<Metadata> {
  const { roleId } = await params;
  const role = internships.find((r) => r.id === roleId);
  if (!role) return {};
  return { title: role.title, description: role.summary };
}

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = await params;
  const role = internships.find((r) => r.id === roleId);
  if (!role) notFound();

  const formattedDate = new Date(role.postedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <section className="relative overflow-hidden bg-black pt-40 pb-20 md:pt-48">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <Link
            href="/internships"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Internships
          </Link>

          <AnimatedReveal className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{role.track}</Badge>
              <Badge tone="accent">{role.duration}</Badge>
              <Badge tone="success">{role.stipend}</Badge>
            </div>
            <h1 className="text-balance mt-5 max-w-3xl text-4xl font-medium text-white sm:text-5xl">
              {role.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {role.location} · {role.locationType}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4" /> {role.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Posted {formattedDate}
              </span>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <AnimatedReveal>
            <p className="text-lg leading-relaxed text-gray-300">{role.summary}</p>

            <h2 className="mt-10 text-xl font-medium text-chalk">Responsibilities</h2>
            <ul className="mt-4 space-y-2">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-gray-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl font-medium text-chalk">Requirements</h2>
            <ul className="mt-4 space-y-2">
              {role.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-gray-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedReveal>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-surface-2 p-6">
              <p className="text-sm text-gray-400">
                Ready to apply? It takes about five minutes.
              </p>
              <Button href={`/internships/apply/${role.id}`} className="mt-4 w-full">
                Apply Now
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
