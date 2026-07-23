import { siteContent } from "../config/siteContent";
import { SectionReveal } from "./SectionReveal";
import { SocialLinks } from "./SocialLinks";

export function Contact() {
  const content = siteContent.contact;

  return (
    <section className="section section--contact" id="contact">
      <SectionReveal>
        <div className="shell contact-card">
          <div>
            <p className="section-eyebrow">{content.eyebrow}</p>
            <h2>{content.title}</h2>
            <p>{content.introduction}</p>
          </div>
          <SocialLinks variant="buttons" ariaLabel={content.linksLabel} />
        </div>
      </SectionReveal>
    </section>
  );
}
