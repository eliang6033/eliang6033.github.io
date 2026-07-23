export type SocialIconName = "github" | "linkedin" | "email" | "resume";
export type HobbyIconName =
  | "plane"
  | "camera"
  | "bike"
  | "target"
  | "film"
  | "gamepad";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  detailLabel: string;
}

export interface Hobby {
  title: string;
  description: string;
  icon: HobbyIconName;
  accent: "cyan" | "gold" | "forest" | "rust" | "blue" | "violet";
}
