import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
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
  return { title: `Apply — ${job.title}` };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = jobs.find((j) => j.id === jobId);
  if (!job) notFound();

  return (
    <section className="bg-white pt-32 pb-24 md:pt-40">
      <Container className="max-w-2xl">
        <Link
          href={`/careers/${job.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to role
        </Link>

        <AnimatedReveal className="mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Application
          </p>
          <h1 className="mt-2 text-3xl font-medium text-black md:text-4xl">{job.title}</h1>
          <p className="mt-3 text-gray-600">
            Takes about five minutes. We review every application personally.
          </p>

          <div className="mt-10">
            <ApplicationForm roleTitle={job.title} roleId={job.id} />
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
