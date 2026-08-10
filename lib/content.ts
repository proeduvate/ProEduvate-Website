/*
 * The site's content accessors.
 *
 * Each one asks the API first and falls back to the static file in `data/`.
 * Components keep their existing prop shapes, so the API is genuinely
 * swappable rather than something the whole UI is now coupled to.
 *
 * These are async and must be called from Server Components. Fetching on the
 * server means the browser never waits on the API, the content is in the
 * initial HTML for crawlers, and the API URL and any future credentials stay
 * off the client.
 *
 * The API returns snake_case straight from the database columns; the mappers
 * below are the single place that is translated into the camelCase the
 * components already use.
 */

import { fetchCollection, fetchSingleton } from "@/lib/api";

import { products as staticProducts, type Product } from "@/data/products";
import { services as staticServices, type Service } from "@/data/services";
import { sectors as staticSectors, type Sector } from "@/data/sectors";
import { domains as staticDomains } from "@/data/domains";
import {
  customProjects as staticCustomProjects,
  type CustomProject,
} from "@/data/custom-projects";
import { timeline as staticTimeline, type Milestone } from "@/data/timeline";
import { stats as staticStats, type Stat } from "@/data/stats";
import {
  achievementHighlights as staticHighlights,
  monthlyStars as staticStars,
  recognitions as staticRecognitions,
  type AchievementHighlight,
  type MonthlyStar,
  type Recognition,
} from "@/data/achievements";
import { values as staticValues, type Value } from "@/data/values";
import { reasons as staticReasons, type Reason } from "@/data/why-choose-us";
import {
  internReviews as staticInternReviews,
  type InternReview,
} from "@/data/intern-reviews";
import { ceo as staticCeo, type CeoProfile } from "@/data/ceo";
import { jobs as staticJobs } from "@/data/jobs";
import { internships as staticInternships } from "@/data/internships";
import type { JobListing, InternshipListing } from "@/data/types";
import {
  orgSpine as staticOrgSpine,
  orgBranch as staticOrgBranch,
  coreTeam as staticCoreTeam,
  type OrgSeat,
  type CoreDiscipline,
} from "@/data/org-chart";
import {
  techStack as staticTechStack,
  clientLogos as staticClientLogos,
} from "@/data/tech-stack";
import {
  address as staticAddress,
  emails as staticEmails,
  incubationCentres as staticIncubationCentres,
  socials as staticSocials,
} from "@/data/contact";

/** Anything the API sends back carries these alongside the content columns. */
type ApiRow = { id: number; position: number; published: boolean };

// --------------------------------------------------------------------------
// Collections
// --------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  const rows = await fetchCollection<
    ApiRow & {
      slug: string;
      name: string;
      tagline: string;
      description: string;
      category: string;
      status: string;
      initials: string;
      external_url: string;
      screenshot: string | null;
      highlights: string[];
    },
    Product
  >("/api/v1/products", (r) => ({
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    category: r.category as Product["category"],
    status: r.status as Product["status"],
    initials: r.initials,
    externalUrl: r.external_url,
    screenshot: r.screenshot ?? undefined,
    highlights: r.highlights,
  }));
  return rows ?? staticProducts;
}

/** Live first, then Beta, then Coming Soon; stable within each group. */
export async function getProductsByStatus(): Promise<Product[]> {
  const order: Record<string, number> = { Live: 0, Beta: 1, "Coming Soon": 2 };
  return [...(await getProducts())].sort((a, b) => order[a.status] - order[b.status]);
}

export async function getServices(): Promise<Service[]> {
  const rows = await fetchCollection<
    ApiRow & {
      slug: string;
      name: string;
      description: string;
      icon: string;
      included: string[];
    },
    Service
  >("/api/v1/services", (r) => ({
    slug: r.slug,
    name: r.name,
    description: r.description,
    icon: r.icon as Service["icon"],
    included: r.included,
  }));
  return rows ?? staticServices;
}

export async function getSectors(): Promise<Sector[]> {
  const rows = await fetchCollection<
    ApiRow & { title: string; description: string; icon: string },
    Sector
  >("/api/v1/sectors", (r) => ({
    title: r.title,
    description: r.description,
    icon: r.icon as Sector["icon"],
  }));
  return rows ?? staticSectors;
}

export async function getDomains(): Promise<string[]> {
  const rows = await fetchCollection<ApiRow & { name: string }, string>(
    "/api/v1/domains",
    (r) => r.name
  );
  return rows ?? staticDomains;
}

export async function getCustomProjects(): Promise<CustomProject[]> {
  const rows = await fetchCollection<
    ApiRow & { slug: string; name: string; description: string; image: string | null },
    CustomProject
  >("/api/v1/custom-projects", (r) => ({
    slug: r.slug,
    name: r.name,
    description: r.description,
    image: r.image ?? "",
  }));
  return rows ?? staticCustomProjects;
}

export async function getMilestones(): Promise<Milestone[]> {
  const rows = await fetchCollection<
    ApiRow & { year: string; title: string; description: string },
    Milestone
  >("/api/v1/milestones", (r) => ({
    year: r.year,
    title: r.title,
    description: r.description,
  }));
  return rows ?? staticTimeline;
}

export async function getStats(): Promise<Stat[]> {
  const rows = await fetchCollection<
    ApiRow & { label: string; value: number; suffix: string },
    Stat
  >("/api/v1/stats", (r) => ({ label: r.label, value: r.value, suffix: r.suffix }));
  return rows ?? staticStats;
}

export async function getAchievementHighlights(): Promise<AchievementHighlight[]> {
  const rows = await fetchCollection<
    ApiRow & { label: string; value: number; suffix: string },
    AchievementHighlight
  >("/api/v1/achievement-highlights", (r) => ({
    label: r.label,
    value: r.value,
    suffix: r.suffix,
  }));
  return rows ?? staticHighlights;
}

export async function getMonthlyStars(): Promise<MonthlyStar[]> {
  const rows = await fetchCollection<
    ApiRow & { month: string; name: string; department: string },
    MonthlyStar
  >("/api/v1/monthly-stars", (r) => ({
    month: r.month,
    name: r.name,
    department: r.department,
  }));
  return rows ?? staticStars;
}

export async function getRecognitions(): Promise<Recognition[]> {
  const rows = await fetchCollection<
    ApiRow & { title: string; description: string },
    Recognition
  >("/api/v1/recognitions", (r) => ({ title: r.title, description: r.description }));
  return rows ?? staticRecognitions;
}

export async function getValues(): Promise<Value[]> {
  const rows = await fetchCollection<
    ApiRow & {
      title: string;
      short_description: string;
      long_description: string;
      icon: string;
    },
    Value
  >("/api/v1/values", (r) => ({
    title: r.title,
    shortDescription: r.short_description,
    longDescription: r.long_description,
    icon: r.icon as Value["icon"],
  }));
  return rows ?? staticValues;
}

export async function getReasons(): Promise<Reason[]> {
  const rows = await fetchCollection<
    ApiRow & { title: string; description: string; icon: string },
    Reason
  >("/api/v1/reasons", (r) => ({
    title: r.title,
    description: r.description,
    icon: r.icon as Reason["icon"],
  }));
  return rows ?? staticReasons;
}

export async function getInternReviews(): Promise<InternReview[]> {
  const rows = await fetchCollection<
    ApiRow & {
      name: string;
      track: string;
      cohort: string;
      initials: string;
      quote: string;
      quote_approved: boolean;
    },
    InternReview
  >("/api/v1/intern-reviews", (r) => ({
    name: r.name,
    track: r.track,
    cohort: r.cohort,
    initials: r.initials,
    quote: r.quote,
    // Carried across as-is. This flag is what stops a drafted quote reading
    // as a real person's words, so it must never be coerced to true.
    quoteApproved: r.quote_approved === true,
  }));
  return rows ?? staticInternReviews;
}

// --------------------------------------------------------------------------
// Singletons
// --------------------------------------------------------------------------

export async function getCeo(): Promise<CeoProfile> {
  const row = await fetchSingleton<
    {
      name: string | null;
      role: string;
      photo: string | null;
      about: string[];
      focus: string[];
      quote: string;
      quote_approved: boolean;
    },
    CeoProfile
  >("/api/v1/ceo", (r) => ({
    name: r.name,
    role: r.role,
    photo: r.photo,
    about: r.about,
    focus: r.focus,
    quote: r.quote,
    quoteApproved: r.quote_approved === true,
  }));
  return row ?? staticCeo;
}

// --------------------------------------------------------------------------
// Hiring
// --------------------------------------------------------------------------

export async function getJobs(): Promise<JobListing[]> {
  const rows = await fetchCollection<
    ApiRow & {
      slug: string;
      title: string;
      department: string;
      employment_type: string;
      location: string;
      location_type: string;
      posted_at: string;
      summary: string;
      responsibilities: string[];
      requirements: string[];
      nice_to_have: string[];
    },
    JobListing
  >("/api/v1/jobs", (r) => ({
    // The table calls it `slug`; the site has always keyed routes on `id`.
    id: r.slug,
    title: r.title,
    department: r.department,
    employmentType: r.employment_type as JobListing["employmentType"],
    location: r.location,
    locationType: r.location_type as JobListing["locationType"],
    postedAt: r.posted_at,
    summary: r.summary,
    responsibilities: r.responsibilities,
    requirements: r.requirements,
    niceToHave: r.nice_to_have?.length ? r.nice_to_have : undefined,
  }));
  return rows ?? staticJobs;
}

export async function getInternships(): Promise<InternshipListing[]> {
  const rows = await fetchCollection<
    ApiRow & {
      slug: string;
      title: string;
      track: string;
      location: string;
      location_type: string;
      duration: string;
      stipend: string;
      posted_at: string;
      summary: string;
      responsibilities: string[];
      requirements: string[];
    },
    InternshipListing
  >("/api/v1/internships", (r) => ({
    id: r.slug,
    title: r.title,
    track: r.track,
    location: r.location,
    locationType: r.location_type as InternshipListing["locationType"],
    duration: r.duration,
    stipend: r.stipend,
    postedAt: r.posted_at,
    summary: r.summary,
    responsibilities: r.responsibilities,
    requirements: r.requirements,
  }));
  return rows ?? staticInternships;
}

// --------------------------------------------------------------------------
// Org chart
// --------------------------------------------------------------------------

/** Spine and branch live in one table, split by `tier`. */
export async function getOrgSeats(): Promise<{ spine: OrgSeat[]; branch: OrgSeat[] }> {
  const rows = await fetchCollection<
    ApiRow & { abbr: string; title: string; holder: string | null; tier: string },
    OrgSeat & { tier: string }
  >("/api/v1/org-seats", (r) => ({
    abbr: r.abbr,
    title: r.title,
    holder: r.holder,
    tier: r.tier,
  }));

  if (!rows) return { spine: staticOrgSpine, branch: staticOrgBranch };

  const spine = rows.filter((r) => r.tier === "spine");
  const branch = rows.filter((r) => r.tier === "branch");
  // A chart with no branch would render as a chain with nothing under it, so
  // treat a partial result as a failure rather than draw something wrong.
  if (spine.length === 0 || branch.length === 0) {
    return { spine: staticOrgSpine, branch: staticOrgBranch };
  }
  return { spine, branch };
}

export async function getCoreTeam(): Promise<CoreDiscipline[]> {
  const rows = await fetchCollection<
    ApiRow & { discipline: string; stack: string[] },
    CoreDiscipline
  >("/api/v1/core-team", (r) => ({ discipline: r.discipline, stack: r.stack }));
  return rows ?? staticCoreTeam;
}

// --------------------------------------------------------------------------
// Stack, clients, contact
// --------------------------------------------------------------------------

export async function getTechStack(): Promise<string[]> {
  const rows = await fetchCollection<ApiRow & { name: string }, string>(
    "/api/v1/tech-stack",
    (r) => r.name
  );
  return rows ?? staticTechStack;
}

export async function getClientLogos(): Promise<string[]> {
  const rows = await fetchCollection<ApiRow & { name: string }, string>(
    "/api/v1/client-logos",
    (r) => r.name
  );
  return rows ?? staticClientLogos;
}

export type SiteContact = {
  address: { lines: string[]; query: string };
  emails: { label: string; value: string }[];
  incubationCentres: string[];
  socials: { label: string; href: string }[];
};

export async function getContact(): Promise<SiteContact> {
  const row = await fetchSingleton<
    {
      address_lines: string[];
      address_query: string;
      emails: { label: string; value: string }[];
      incubation_centres: string[];
      socials: { label: string; href: string }[];
    },
    SiteContact
  >("/api/v1/contact", (r) => ({
    address: { lines: r.address_lines, query: r.address_query },
    emails: r.emails,
    incubationCentres: r.incubation_centres,
    socials: r.socials,
  }));

  return (
    row ?? {
      address: staticAddress,
      emails: staticEmails,
      incubationCentres: staticIncubationCentres,
      socials: staticSocials,
    }
  );
}
