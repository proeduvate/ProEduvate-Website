/*
 * Dumps the site's TypeScript data files to backend/seed_data.json.
 *
 *   node scripts/export-content.mjs
 *
 * The backend seeds from this, so the database starts as an exact copy of
 * what the site renders today rather than hand-retyped content that would
 * silently disagree with it. Run again if data/ changes before a reseed.
 *
 * Uses a TypeScript-aware loader because the data files are .ts; nothing here
 * imports React, so they load standalone.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const load = async (file) => import(path.join(root, "data", file));

const [
  products,
  services,
  sectors,
  domains,
  customProjects,
  timeline,
  stats,
  achievements,
  values,
  whyChooseUs,
  internReviews,
  jobs,
  internships,
  orgChart,
  techStack,
  ceo,
  contact,
] = await Promise.all(
  [
    "products.ts",
    "services.ts",
    "sectors.ts",
    "domains.ts",
    "custom-projects.ts",
    "timeline.ts",
    "stats.ts",
    "achievements.ts",
    "values.ts",
    "why-choose-us.ts",
    "intern-reviews.ts",
    "jobs.ts",
    "internships.ts",
    "org-chart.ts",
    "tech-stack.ts",
    "ceo.ts",
    "contact.ts",
  ].map(load)
);

const snake = (rows, map) => rows.map(map);

const payload = {
  products: snake(products.products, (p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    category: p.category,
    status: p.status,
    initials: p.initials ?? "",
    external_url: p.externalUrl ?? "#",
    screenshot: p.screenshot ?? null,
    highlights: p.highlights ?? [],
  })),
  services: snake(services.services, (s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description ?? "",
    icon: s.icon ?? "",
    included: s.included ?? [],
  })),
  sectors: snake(sectors.sectors, (s) => ({
    title: s.title,
    description: s.description ?? "",
    icon: s.icon ?? "",
  })),
  domains: snake(domains.domains, (name) => ({ name })),
  custom_projects: snake(customProjects.customProjects, (p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    image: p.image ?? null,
  })),
  milestones: snake(timeline.timeline, (m) => ({
    year: m.year,
    title: m.title,
    description: m.description ?? "",
  })),
  stats: snake(stats.stats, (s) => ({
    label: s.label,
    value: s.value,
    suffix: s.suffix ?? "",
  })),
  achievement_highlights: snake(achievements.achievementHighlights, (a) => ({
    label: a.label,
    value: a.value,
    suffix: a.suffix ?? "",
  })),
  monthly_stars: snake(achievements.monthlyStars, (s) => ({
    month: s.month,
    name: s.name,
    department: s.department ?? "",
  })),
  recognitions: snake(achievements.recognitions, (r) => ({
    title: r.title,
    description: r.description ?? "",
  })),
  values: snake(values.values, (v) => ({
    title: v.title,
    short_description: v.shortDescription ?? "",
    long_description: v.longDescription ?? "",
    icon: v.icon ?? "",
  })),
  reasons: snake(whyChooseUs.reasons, (r) => ({
    title: r.title,
    description: r.description ?? "",
    icon: r.icon ?? "",
  })),
  intern_reviews: snake(internReviews.internReviews, (r) => ({
    name: r.name,
    track: r.track ?? "",
    cohort: r.cohort ?? "",
    initials: r.initials ?? "",
    quote: r.quote ?? "",
    // Carried across as-is. Never default this to true: it is what keeps a
    // drafted quote from reading as a real person's words.
    quote_approved: r.quoteApproved === true,
  })),
  jobs: snake(jobs.jobs, (j) => ({
    slug: j.id,
    title: j.title,
    department: j.department ?? "",
    employment_type: j.employmentType ?? "part-time",
    location: j.location ?? "Remote",
    location_type: j.locationType ?? "Remote",
    posted_at: j.postedAt ?? "",
    summary: j.summary ?? "",
    responsibilities: j.responsibilities ?? [],
    requirements: j.requirements ?? [],
    nice_to_have: j.niceToHave ?? [],
  })),
  internships: snake(internships.internships, (i) => ({
    slug: i.id,
    title: i.title,
    track: i.track ?? "",
    location: i.location ?? "Remote",
    location_type: i.locationType ?? "Remote",
    duration: i.duration ?? "",
    stipend: i.stipend ?? "",
    posted_at: i.postedAt ?? "",
    summary: i.summary ?? "",
    responsibilities: i.responsibilities ?? [],
    requirements: i.requirements ?? [],
  })),
  org_seats: [
    ...orgChart.orgSpine.map((s) => ({ ...s, tier: "spine" })),
    ...orgChart.orgBranch.map((s) => ({ ...s, tier: "branch" })),
  ].map((s) => ({ abbr: s.abbr, title: s.title, holder: s.holder ?? null, tier: s.tier })),
  core_team: snake(orgChart.coreTeam, (p) => ({
    discipline: p.discipline,
    stack: p.stack ?? [],
  })),
  tech_stack: snake(techStack.techStack, (name) => ({ name })),
  client_logos: snake(techStack.clientLogos, (name) => ({ name })),
  ceo: {
    name: ceo.ceo.name ?? null,
    role: ceo.ceo.role ?? "",
    photo: ceo.ceo.photo ?? null,
    about: ceo.ceo.about ?? [],
    focus: ceo.ceo.focus ?? [],
    quote: ceo.ceo.quote ?? "",
    quote_approved: ceo.ceo.quoteApproved === true,
  },
  contact: {
    address_lines: contact.address.lines ?? [],
    address_query: contact.address.query ?? "",
    emails: contact.emails ?? [],
    incubation_centres: contact.incubationCentres ?? [],
    socials: contact.socials ?? [],
  },
};

const out = path.join(root, "backend", "seed_data.json");
await writeFile(out, JSON.stringify(payload, null, 2));

const counts = Object.entries(payload)
  .map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : 1}`)
  .join("  ");
console.log(`wrote backend/seed_data.json\n${counts}`);
