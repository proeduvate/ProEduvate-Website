/*
 * ProEduvate's reporting structure.
 *
 * Role titles are real. Names are NOT -- nobody has supplied who holds each
 * post, so `holder` is left null and the chart renders the seat rather than
 * inventing a person to sit in it. Fill these in before launch.
 *
 * The six core-team disciplines are taken from the departments already used
 * by the Star of the Month records in `data/achievements.ts`, so the two
 * sections describe the same company rather than two different ones.
 */

export interface OrgSeat {
  abbr: string;
  title: string;
  holder: string | null;
}

export interface CoreDiscipline {
  discipline: string;
  /** Primary technologies this pod owns, drawn from the company stack. */
  stack: string[];
}

/** Single-report chain from the top down to the first branch. */
export const orgSpine: OrgSeat[] = [
  { abbr: "CEO", title: "Chief Executive Officer", holder: null },
  { abbr: "Manager", title: "Manager", holder: null },
  { abbr: "COO", title: "Chief Operating Officer", holder: null },
];

/** The COO's two direct reports. Both feed the same core team. */
export const orgBranch: OrgSeat[] = [
  { abbr: "COP", title: "Chief of Projects", holder: null },
  { abbr: "COT", title: "Chief of Technology", holder: null },
];

export const coreTeam: CoreDiscipline[] = [
  { discipline: "Full Stack Development", stack: ["Next.js", "TypeScript", "Node.js"] },
  { discipline: "Front End Development", stack: ["React", "Tailwind CSS"] },
  { discipline: "Backend Development", stack: ["Node.js", "PostgreSQL"] },
  { discipline: "Software Development", stack: ["Python", "Docker"] },
  { discipline: "AI & Machine Learning", stack: ["OpenAI / LLM Stack", "Python"] },
  { discipline: "Human Resource", stack: ["People & Hiring"] },
];

export const internTrack = {
  label: "Interns",
  description:
    "Each cohort joins a core discipline and ships alongside it, reporting into that pod's lead.",
};
