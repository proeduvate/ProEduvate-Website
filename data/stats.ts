export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

// 17 in-house products + 11 delivered client projects.
export const stats: Stat[] = [
  { value: 28, suffix: "", label: "Projects Built" },
  { value: 6, suffix: "+", label: "Institutions Served" },
  { value: 21, suffix: "+", label: "Team Members" },
  { value: 1, suffix: "", label: "Year Building" },
];
