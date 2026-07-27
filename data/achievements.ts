export interface AchievementHighlight {
  value: number;
  suffix: string;
  label: string;
}

export const achievementHighlights: AchievementHighlight[] = [
  { value: 15, suffix: "", label: "Products developed" },
  { value: 2, suffix: "", label: "College collaborations" },
  { value: 1, suffix: "", label: "Symposium sponsored" },
];

export interface MonthlyStar {
  month: string;
  name: string;
  department: string;
}

export const monthlyStars: MonthlyStar[] = [
  { month: "January", name: "Hari Rajan", department: "Full Stack Development" },
  { month: "February", name: "Rohith", department: "Backend Development" },
  { month: "March", name: "Arunachalam", department: "Front End Development" },
  { month: "April", name: "Sakthi", department: "Software Development" },
  { month: "May", name: "Manjushri", department: "Human Resource" },
  { month: "June", name: "Jayashri", department: "AI & Machine Learning" },
];

export interface Recognition {
  title: string;
  description: string;
}

export const recognitions: Recognition[] = [
  { title: "Best Department", description: "Product Development" },
  { title: "Best Tech Lead", description: "Full Stack Development Head" },
  { title: "Best Chief", description: "Chief of Projects" },
  { title: "Special Recognition", description: "Hiring for social cause" },
];
