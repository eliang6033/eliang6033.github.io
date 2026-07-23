import { ArrowRight } from "lucide-react";
import { siteContent } from "../config/siteContent";
import { travelStats } from "../data/travel";
import { SectionReveal } from "./SectionReveal";

interface JourneyPreviewProps {
  onOpenJourney: () => void;
}

export function JourneyPreview({ onOpenJourney }: JourneyPreviewProps) {
  const content = siteContent.journeyPreview;

  return (
    <section className="section section--journey" id="journey">
      <SectionReveal>
        <div className="shell">
          <div className="journey-card">
            <div className="journey-card__copy">
              <p className="section-eyebrow section-eyebrow--dark">
                {content.eyebrow}
              </p>
              <h2>{content.title}</h2>
              <p>{content.subtitle}</p>

              <dl className="journey-stats">
                {travelStats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <button
                className="button button--journey"
                type="button"
                onClick={onOpenJourney}
              >
                <span>{content.action}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="journey-preview-visual" aria-label={content.previewLabel}>
              <div className="preview-stars" aria-hidden="true" />
              <div className="preview-globe" aria-hidden="true">
                <span className="preview-globe__line preview-globe__line--one" />
                <span className="preview-globe__line preview-globe__line--two" />
                <span className="preview-globe__line preview-globe__line--three" />
                <span className="preview-globe__pin preview-globe__pin--one" />
                <span className="preview-globe__pin preview-globe__pin--two" />
                <span className="preview-globe__pin preview-globe__pin--three" />
              </div>
              <p>{content.orbitLabel}</p>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
