"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import {
  apiBase,
  apiConfigured,
  clearToken,
  getToken,
  getTokenServerSnapshot,
  subscribeToken,
  tokenSubject,
  COLLECTIONS,
  SINGLETONS,
} from "@/lib/admin/api";
import { LoginForm } from "@/components/admin/LoginForm";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { cn } from "@/lib/utils";

/*
 * The whole admin, on one route.
 *
 * It is deliberately client-only and unlinked: nothing on the site points
 * here, it is excluded from the sitemap and from robots.txt, and it carries a
 * noindex. That is obscurity, not security -- the real gate is the token the
 * API demands on every write. Reads stay public because the site itself is.
 *
 * Which collection you are editing is local state rather than a nested route.
 * A URL per collection would buy deep links into an editor nobody bookmarks,
 * at the cost of a dynamic segment that has to stay in step with the API's
 * list of collections.
 */

type Selection =
  | { type: "collection"; slug: string; label: string }
  | { type: "singleton"; slug: string; label: string };

const DEFAULT_SELECTION: Selection = {
  type: "collection",
  slug: COLLECTIONS[0].slug,
  label: COLLECTIONS[0].label,
};

export function AdminApp() {
  // Subscribed rather than copied into state: an expired token is discarded
  // by the fetch layer the moment the API rejects it, and that has to put the
  // login form straight back on screen.
  const token = useSyncExternalStore(subscribeToken, getToken, getTokenServerSnapshot);
  const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);

  if (!apiConfigured) {
    return (
      <Centred>
        <p className="text-sm text-warning">
          NEXT_PUBLIC_API_URL is not set, so there is no content API to edit.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Set it in <code className="text-gray-300">.env.local</code> and restart the dev server.
        </p>
      </Centred>
    );
  }

  // No token yet, and also every server render — sessionStorage does not
  // exist there, so the login form is what hydration starts from.
  if (!token) return <LoginForm />;

  const signOut = () => {
    clearToken();
    setSelection(DEFAULT_SELECTION);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-3 md:px-8">
          <Image src="/icon.png" alt="" width={64} height={64} className="h-7 w-7 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm leading-none text-chalk">Content admin</p>
            <p className="label-micro mt-1 truncate text-gray-600">
              {tokenSubject(token) ?? "signed in"}
            </p>
          </div>
          <Link
            href="/"
            className="label-micro hidden items-center gap-1.5 text-gray-500 transition-colors hover:text-accent sm:inline-flex"
          >
            View site
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            onClick={signOut}
            className="label-micro inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-gray-400 transition-colors hover:border-white/35 hover:text-chalk"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-8 md:px-8 lg:flex-row lg:gap-10">
        <nav className="lg:w-56 lg:shrink-0" aria-label="Content sections">
          <Group title="Collections">
            {COLLECTIONS.map((entry) => (
              <NavItem
                key={entry.slug}
                active={selection.type === "collection" && selection.slug === entry.slug}
                onClick={() =>
                  setSelection({ type: "collection", slug: entry.slug, label: entry.label })
                }
              >
                {entry.label}
              </NavItem>
            ))}
          </Group>

          <Group title="Single records">
            {SINGLETONS.map((entry) => (
              <NavItem
                key={entry.slug}
                active={selection.type === "singleton" && selection.slug === entry.slug}
                onClick={() =>
                  setSelection({ type: "singleton", slug: entry.slug, label: entry.label })
                }
              >
                {entry.label}
              </NavItem>
            ))}
          </Group>

          <p className="mt-8 hidden text-[11px] leading-relaxed text-gray-700 lg:block">
            Connected to {apiBase}. Published pages are cached for a minute, so a
            change can take up to that long to appear on the site.
          </p>
        </nav>

        <main className="min-w-0 flex-1">
          {selection.type === "collection" ? (
            <CollectionEditor key={selection.slug} slug={selection.slug} label={selection.label} />
          ) : (
            <SingletonEditor key={selection.slug} slug={selection.slug} label={selection.label} />
          )}
        </main>
      </div>
    </div>
  );
}

function Centred({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="label-micro mb-2 px-3 text-gray-700">{title}</p>
      {/* Horizontal chips on small screens, a real sidebar from lg up. */}
      <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </ul>
    </div>
  );
}

function NavItem({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li className="shrink-0">
      <button
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={cn(
          "w-full whitespace-nowrap border-l-2 px-3 py-2 text-left text-sm transition-colors",
          active
            ? "border-accent bg-accent/10 text-chalk"
            : "border-transparent text-gray-500 hover:bg-white/[0.03] hover:text-gray-200"
        )}
      >
        {children}
      </button>
    </li>
  );
}
