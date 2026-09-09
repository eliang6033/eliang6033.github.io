export type SocialIconName = "github" | "linkedin" | "email" | "resume";
export type HobbyIconName =
  | "plane"
  | "camera"
  | "bike"
  | "target"
  | "feather"
  | "film"
  | "gamepad";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
}

export interface EntryLink {
  label: string;
  url: string;
}

export interface ResearchEntry {
  year: string;
  title: string;
  venue?: string;
  description?: string;
  links?: EntryLink[];
}

export interface InternshipEntry {
  year: string;
  role: string;
  institution: string;
  tags: string[];
  links: EntryLink[];
}

export interface ResearchCategoryContent {
  number: string;
  label: string;
  listTitle: string;
  emptyState: string;
}

export interface InternshipCategoryContent {
  number: string;
  label: string;
}

export interface Hobby {
  title: string;
  icon: HobbyIconName;
  accent: "cyan" | "gold" | "forest" | "rust" | "blue" | "violet";
}
