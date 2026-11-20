import { ArrowRight } from "lucide-react";
import { siteContent } from "../config/siteContent";
import portrait from "../assets/folio/eli-windmills.jpg";
import { SocialLinks } from "./SocialLinks";

export function Hero() {
  const content = siteContent.hero;
  const parts = content.name.match(/^([^()]+)(\([^()]+\))(.*)$/);

  return (
    <section className="hero shell" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-eyebrow">{content.eyebrow}</p>
        <h1 id="hero-title" aria-label={content.name}>
          {parts ? <>
            <span className="hero-name-line">{parts[1]}</span>
            <span className="hero-name-line"><em>{parts[2]}</em>{parts[3]}</span>
          </> : content.name}
        </h1>
        <p className="hero-degree">{content.degrees}</p>
        <p className="hero-school">{content.school}</p>
        <div className="hero-actions">
          <a className="folio-action" href="#projects">
            {content.primaryAction}<ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <SocialLinks />
      </div>
      <figure className="folio-plate">
        <img className="folio-plate__portrait" src={portrait} width="1024" height="1536" alt={content.portraitAlt} />
        <figcaption>
          <span className="folio-plate__title">{content.visualCenterLabel}</span>
          <ul role="list">{content.visualNodes.map(label => <li key={label}>{label}</li>)}</ul>
        </figcaption>
      </figure>
    </section>
  );
}
