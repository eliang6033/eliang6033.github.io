import type {
  InternshipCategoryContent,
  InternshipEntry,
  ResearchCategoryContent,
  ResearchEntry,
} from "../types/content";

export const researchCategory: ResearchCategoryContent = {
  number: "01",
  label: "Research",
  listTitle: "Selected Research",
  emptyState: "Selected research and publications coming soon.",
};

export const internshipCategory: InternshipCategoryContent = {
  number: "02",
  label: "Internships",
};

export const researchEntries: ResearchEntry[] = [];

export const internshipEntries: InternshipEntry[] = [
  {
    role: "Full Stack Development",
    year: "2025",
    institution: "The Centre for Entrepreneurship, TU Berlin",
    tags: ["Full Stack"],
    links: [
      {
        label: "Leapsome",
        url: "https://www.leapsome.com/",
      },
    ],
  },
  {
    role: "AI Research Intern",
    year: "2026",
    institution: "Ropedia",
    tags: ["World Models"],
    links: [],
  },
];
