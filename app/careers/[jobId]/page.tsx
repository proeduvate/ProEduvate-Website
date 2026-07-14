import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { jobs } from "@/data/jobs";

export function generateStaticParams() {
  return jobs.map((job) => ({ jobId: job.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return {};
  return {
    title: job.title,
    description: job.summary,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = jobs.find((j) => j.id === jobId);
  if (!job) notFound();

  const formattedDate = new Date(job.postedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.postedAt,
    employmentType: job.employmentType === "full-time" ? "FULL_TIME" : "PART_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "ProEduvate",
      sameAs: "https://proeduvate.in",
    },
    jobLocationType: job.locationType === "Remote" ? "TELECOMMUTE" : undefined,
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-black pt-40 pb-20 md:pt-48">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Careers
          </Link>

          <AnimatedReveal className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{job.department}</Badge>
              <Badge tone={job.employmentType === "part-time" ? "warning" : "accent"}>
                {job.employmentType === "full-time" ? "Full-Time" : "Part-Time"}
              </Badge>
            </div>
            <h1 className="text-balance mt-5 max-w-3xl text-4xl font-medium text-white sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {job.location} · {job.locationType}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Posted {formattedDate}
              </span>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <AnimatedReveal>
            <p className="text-lg leading-relaxed text-gray-700">{job.summary}</p>

            <h2 className="mt-10 text-xl font-medium text-black">Responsibilities</h2>
            <ul className="mt-4 space-y-2">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl font-medium text-black">Requirements</h2>
            <ul className="mt-4 space-y-2">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            {job.niceToHave && job.niceToHave.length > 0 && (
              <>
                <h2 className="mt-10 text-xl font-medium text-black">Nice to Have</h2>
                <ul className="mt-4 space-y-2">
                  {job.niceToHave.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </AnimatedReveal>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-off-white p-6">
              <p className="text-sm text-gray-600">
                Ready to apply? It takes about five minutes.
              </p>
              <Button href={`/careers/apply/${job.id}`} className="mt-4 w-full">
                Apply Now
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
