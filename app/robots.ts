import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The content editor. Not secret -- the API is what enforces access --
      // but there is nothing here for a crawler and no reason to advertise it.
      disallow: "/admin",
    },
    sitemap: "https://proeduvate.in/sitemap.xml",
  };
}
