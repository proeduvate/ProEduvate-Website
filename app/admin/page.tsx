import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

/*
 * The content editor. Reachable only by typing /admin -- nothing links here,
 * it is absent from the sitemap, and robots.txt disallows it.
 */

export const metadata: Metadata = {
  title: "Content admin",
  // Belt and braces with robots.txt: a disallow keeps crawlers from fetching
  // the page, this keeps it out of the index if one ever does.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminApp />;
}
