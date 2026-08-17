"use client";

import { usePathname } from "next/navigation";

/*
 * Wraps the page in the site's navbar, footer and loaders -- except on
 * /admin, which is a tool rather than a page and wants none of them.
 *
 * The alternative was a second root layout under a route group, which would
 * mean moving every existing page into a group of its own. This keeps the one
 * root layout and switches the chrome instead; `header` and `footer` arrive
 * as already-rendered elements, so the Footer stays a server component with
 * its content fetched on the server.
 */

const BARE_ROUTES = ["/admin"];

export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (bare) {
    return <main id="main-content" className="flex-1">{children}</main>;
  }

  return (
    <>
      {header}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
