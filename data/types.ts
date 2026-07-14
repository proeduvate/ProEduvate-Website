export type EmploymentType = "full-time" | "part-time";
export type LocationType = "Remote" | "On-site" | "Hybrid";

export interface JobListing {
  id: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  postedAt: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}

export interface InternshipListing {
  id: string;
  title: string;
  track: string;
  location: string;
  locationType: LocationType;
  duration: string;
  stipend: string;
  postedAt: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}
