import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
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
  return { title: `Apply — ${role.title}` };
}

export default async function InternshipApplyPage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = await params;
  const role = internships.find((r) => r.id === roleId);
  if (!role) notFound();

  return (
    <section className="bg-white pt-32 pb-24 md:pt-40">
      <Container className="max-w-2xl">
        <Link
          href={`/internships/${role.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to role
        </Link>

        <AnimatedReveal className="mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Application
          </p>
          <h1 className="mt-2 text-3xl font-medium text-black md:text-4xl">{role.title}</h1>
          <p className="mt-3 text-gray-600">
            Takes about five minutes. We review every application personally.
          </p>

          <div className="mt-10">
            <ApplicationForm roleTitle={role.title} roleId={role.id} />
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
