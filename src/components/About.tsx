import { siteContent } from "../config/siteContent";
import { travelStats } from "../data/travel";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

export function About() {
  const content = siteContent.about;
  const countriesVisited = travelStats[0].value;

  const facts = [
    {
      value: content.facts.location.value,
      label: content.facts.location.label,
    },
    {
      value: content.facts.focus.value,
      label: content.facts.focus.label,
    },
    {
      value: countriesVisited,
      label: content.facts.countries.label,
    },
  ];

  return (
    <section className="section section--about" id="about">
      <SectionReveal>
        <div className="shell">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <div className="about-layout">
            <div className="about-copy">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="about-facts">
              {facts.map(({ value, label }) => (
                <div className="about-fact" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
