import { siteContent } from "../config/siteContent";
import { hobbies } from "../data/hobbies";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

export function Hobbies() {
  const content = siteContent.hobbies;

  return (
    <section className="section section--hobbies" id="hobbies">
      <SectionReveal>
        <div className="shell">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <ul className="hobby-list" role="list">
            {hobbies.map((hobby) => (
              <li className="hobby-item" key={hobby.title}>{hobby.title}</li>
            ))}
          </ul>
        </div>
      </SectionReveal>
    </section>
  );
}
