import type {
  InternshipCategoryContent,
  InternshipEntry,
  ResearchCategoryContent,
  ResearchEntry,
} from "../types/content";

export const researchCategory: ResearchCategoryContent = {
  number: "01",
  label: "Research",
  listTitle: "Publication",
  emptyState: "Selected research and publications coming soon.",
};

export const internshipCategory: InternshipCategoryContent = {
  number: "02",
  label: "Internships",
};

export const researchEntries: ResearchEntry[] = [
  {
    title:
      "Ropedia W0: Scaling Loco-Manipulation World Models across Embodiments with Human Experience",
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
      { label: "Preprint", url: "https://arxiv.org/abs/2610.26855" },
      { label: "Project page", url: "https://ropedia.github.io/ropedia-w0/" },
    ],
  },
  {
    title: "4DNeX: Feed-Forward 4D Generative Modeling Made Easy",
    authors: [
      { name: "Zhaoxi Chen" },
      { name: "Tianqi Liu" },
      { name: "Long Zhuo" },
      { name: "Jiawei Ren" },
      { name: "Zeng Tao" },
      { name: "He Zhu" },
      { name: "Qifeng Liang", highlight: true },
      { name: "Hanfei Zhao" },
      { name: "Fangzhou Hong" },
      { name: "Liang Pan" },
      { name: "Ziwei Liu" },
    ],
    description: "Authors shown for the IEEE TPAMI revision, currently under review. Contributed to the rebuttal.",
    links: [
      { label: "Preprint", url: "https://arxiv.org/abs/2508.13154" },
      { label: "Project page", url: "https://4dnex.github.io/" },
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
  {
    year: "2026",
    role: "Undergraduate Researcher",
    institution: "Safe Autonomous Systems Lab, UC San Diego",
    tags: ["Safe Generative Planning"],
    links: [],
  },
];
