import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { posts } from "@/data/blog";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="bg-surface pt-32 pb-24 md:pt-40">
      <Container className="max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Insights
        </Link>

        <AnimatedReveal className="mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {formattedDate} · {post.readingTime}
          </p>
          <h1 className="mt-3 text-3xl font-medium text-chalk md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-gray-500">By {post.author}</p>

          <div className="mt-10 space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
