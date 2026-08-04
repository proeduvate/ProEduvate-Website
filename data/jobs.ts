/*
 * Open roles at ProEduvate.
 *
 * Titles, employment type, format and compensation are as supplied by the
 * company. The summary/responsibilities/requirements below are drafted from
 * the role titles and should be reviewed before launch -- they were not
 * dictated, so treat them as a first pass rather than approved copy.
 */
import type { JobListing } from "./types";

export const jobs: JobListing[] = [
  {
    id: "project-management-associate",
    title: "Project Management Associate",
    department: "Projects",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-08-01",
    summary:
      "Keep client and in-house projects moving — timelines, check-ins, and the follow-through that stops work stalling between handoffs.",
    responsibilities: [
      "Track project milestones and flag slippage early",
      "Run status check-ins and keep written notes the team can act on",
      "Coordinate handoffs between design, engineering, and the client",
      "Maintain project documentation as scope changes",
    ],
    requirements: [
      "Organised and comfortable chasing things to completion",
      "Clear written English for an async, remote team",
      "Available part-time on a predictable weekly schedule",
    ],
  },
  {
    id: "business-development-associate",
    title: "Business Development Associate",
    department: "Business Development",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-08-01",
    summary:
      "Open conversations with institutions and companies who need software built to our standard, and carry them through to a scoped brief.",
    responsibilities: [
      "Research and reach out to prospective institutional and enterprise clients",
      "Qualify inbound enquiries and route them to the right team",
      "Support proposals and scoping conversations",
      "Keep the pipeline and follow-ups current",
    ],
    requirements: [
      "Confident starting conversations with people you have not met",
      "Able to explain technical work in plain language",
      "Available part-time on a predictable weekly schedule",
    ],
  },
  {
    id: "hr-management-associate-intern",
    title: "HR Management Associate (Intern)",
    department: "Human Resource",
    employmentType: "part-time",
    location: "Remote",
    locationType: "Remote",
    postedAt: "2026-08-01",
    summary:
      "Support hiring and people operations across our internship cohorts and core team — sourcing, scheduling, and onboarding.",
    responsibilities: [
      "Screen applications and schedule interviews across tracks",
      "Support onboarding for new interns and team members",
      "Keep people records and cohort documentation up to date",
      "Help run internal check-ins and feedback cycles",
    ],
    requirements: [
      "Interest in people operations and early-stage hiring",
      "Discreet with confidential information",
      "Available part-time on a predictable weekly schedule",
    ],
  },
];
