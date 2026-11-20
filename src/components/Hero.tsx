import { ArrowRight } from "lucide-react";
import { siteContent } from "../config/siteContent";
import armPlate from "../assets/folio/arm-study.svg";
import { SocialLinks } from "./SocialLinks";

interface HeroProps {
  onOpenJourney: () => void;
  onPreloadJourney: () => void;
}

export function Hero({ onOpenJourney, onPreloadJourney }: HeroProps) {
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
          <button className="folio-action" type="button" onClick={onOpenJourney}
            onPointerEnter={onPreloadJourney} onFocus={onPreloadJourney}>
            {content.primaryAction}<ArrowRight size={16} aria-hidden="true" />
          </button>
          <a className="folio-text-link" href="#projects">{content.secondaryAction}</a>
        </div>
        <SocialLinks />
      </div>
      <figure className="folio-plate" aria-label={content.visualLabel}>
        <img className="folio-plate__drawing" src={armPlate} width="516" height="380" alt="" />
        <figcaption>
          <span className="folio-plate__title">{content.visualCenterLabel}</span>
          <ul role="list">{content.visualNodes.map(label => <li key={label}>{label}</li>)}</ul>
        </figcaption>
      </figure>
    </section>
  );
}
