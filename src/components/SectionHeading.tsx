import { formatSectionLabel } from "../utils/sectionLabel";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  introduction?: string;
  tone?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  title,
  introduction,
  tone = "light",
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${tone}`}>
      <p className="section-eyebrow">{formatSectionLabel(eyebrow)}</p>
      <h2>{title}</h2>
      {introduction ? <p className="section-intro">{introduction}</p> : null}
    </header>
  );
}
