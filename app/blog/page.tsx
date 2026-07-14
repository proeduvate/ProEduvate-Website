import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { posts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thought-leadership on AI in EdTech and enterprise software from the ProEduvate team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes on AI, EdTech, and building software that lasts."
      />

      <section className="bg-white py-20 md:py-28">
        <Container>
          <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <AnimatedReveal key={post.slug} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-off-white p-7 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_20px_60px_-24px_rgba(20,113,240,0.25)]"
                >
                  <p className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {post.readingTime}
                  </p>
                  <h2 className="mt-3 text-xl font-medium text-black">{post.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Read more
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </AnimatedReveal>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
