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

export const researchEntries: ResearchEntry[] = [
  {
    title:
      "Xperience-0: Scaling Loco-Manipulation World Models across Embodiments with Human Experience",
    authors: [
      { name: "Tianqi Liu", marker: "*" },
      { name: "Hanfei Zhao", marker: "*" },
      { name: "Qifeng Liang", marker: "*", highlight: true },
      { name: "Hui En Pang" },
      { name: "Jiarui Xu" },
      { name: "Sayang Mu" },
      { name: "Penghao Qiu" },
      { name: "YingSheng Zhang" },
      { name: "Jun Wang" },
      { name: "Ziang Cao" },
      { name: "Mingze Sun" },
      { name: "Yukang Cao" },
      { name: "Fangzhou Hong" },
      { name: "Zhaoxi Chen" },
      { name: "Ziwei Liu" },
    ],
    authorNote: "* Equal contribution",
    links: [
      { label: "Project page", url: "https://ropedia.github.io/Xperience-0/" },
    ],
  },
];

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
    links: [
      {
        label: "Ropedia",
        url: "https://ropedia.com/",
      },
    ],
  },
];
