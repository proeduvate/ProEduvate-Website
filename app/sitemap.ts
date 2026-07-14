import type { MetadataRoute } from "next";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";
import { posts } from "@/data/blog";

const siteUrl = "https://proeduvate.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/services",
    "/careers",
    "/internships",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const jobRoutes = jobs.map((job) => ({
    url: `${siteUrl}/careers/${job.id}`,
    lastModified: new Date(job.postedAt),
  }));

  const internshipRoutes = internships.map((role) => ({
    url: `${siteUrl}/internships/${role.id}`,
    lastModified: new Date(role.postedAt),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...jobRoutes, ...internshipRoutes, ...postRoutes];
}
