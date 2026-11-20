import { BrainCircuit, MapPin, Plane } from "lucide-react";
import { siteContent } from "../config/siteContent";
import { travelStats } from "../data/travel";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

export function About() {
  const content = siteContent.about;
  const countriesVisited = travelStats[0].value;

  const facts = [
    {
      icon: MapPin,
      value: content.facts.location.value,
      label: content.facts.location.label,
    },
    {
      icon: BrainCircuit,
      value: content.facts.focus.value,
      label: content.facts.focus.label,
    },
    {
      icon: Plane,
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
              {facts.map(({ icon: Icon, value, label }) => (
                <div className="about-fact" key={label}>
                  <dt>
                    <Icon aria-hidden="true" size={16} />
                    {label}
                  </dt>
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
