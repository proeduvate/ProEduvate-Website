export interface Sector {
  title: string;
  description: string;
  icon:
    | "graduation-cap"
    | "accessibility"
    | "stethoscope"
    | "code"
    | "brain-circuit"
    | "users"
    | "cloud"
    | "database";
}

export const sectors: Sector[] = [
  {
    title: "EdTech",
    description: "Learning platforms and campus systems for institutions.",
    icon: "graduation-cap",
  },
  {
    title: "Assistive Technology",
    description: "Software that removes barriers, not adds to them.",
    icon: "accessibility",
  },
  {
    title: "Medtech",
    description: "Clinical and patient-facing software built with care.",
    icon: "stethoscope",
  },
  {
    title: "Software & IT Solutions",
    description: "Custom applications and internal tooling that scale.",
    icon: "code",
  },
  {
    title: "AI Solutions",
    description: "AI-native products and automation, not bolted-on features.",
    icon: "brain-circuit",
  },
  {
    title: "HR & Management Solutions",
    description: "Tools that make running people and operations easier.",
    icon: "users",
  },
  {
    title: "Cloud Consultancy",
    description: "Architecture, migration, and infrastructure done right.",
    icon: "cloud",
  },
  {
    title: "Data Management",
    description: "Pipelines and platforms that make data trustworthy.",
    icon: "database",
  },
];
