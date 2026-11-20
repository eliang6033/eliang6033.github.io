import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import atlasImage from "../assets/journey/atlas-hemispheres.svg";
import atlasViews from "../assets/journey/atlas-views.json";
import { siteContent } from "../config/siteContent";
import { getTravelMapTier, travelLocations, travelStats } from "../data/travel";
import { formatSectionLabel } from "../utils/sectionLabel";
import { SectionReveal } from "./SectionReveal";

interface JourneyPreviewProps {
  onOpenJourney: () => void;
  onPreloadJourney: () => void;
}

// Project each live travel record onto the same two views as the static engraving.
// No map library, WebGL or GeoJSON is loaded to display this homepage figure.
const radians = Math.PI / 180;
const atlasPins = travelLocations.flatMap(location => {
  const lat = location.coordinates.lat * radians;
  for (const view of atlasViews.hemispheres) {
    const lat0 = view.latitude * radians;
    const delta = (location.coordinates.lng - view.longitude) * radians;
    const cosLat = Math.cos(lat);
    if (Math.sin(lat0) * Math.sin(lat) + Math.cos(lat0) * cosLat * Math.cos(delta) < 0) continue;
    return [{
      isoCode: location.isoCode,
      tier: getTravelMapTier(location),
      x: view.x + atlasViews.radius * cosLat * Math.sin(delta),
      y: view.y - atlasViews.radius * (Math.cos(lat0) * Math.sin(lat) - Math.sin(lat0) * cosLat * Math.cos(delta)),
    }];
  }
  return [];
}).sort((a, b) => Number(a.tier === "chapter") - Number(b.tier === "chapter"));

export function JourneyPreview({
  onOpenJourney,
  onPreloadJourney,
}: JourneyPreviewProps) {
  const content = siteContent.journeyPreview;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        onPreloadJourney();
        observer.disconnect();
      },
      { rootMargin: "500px 0px", threshold: 0.01 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [onPreloadJourney]);

  return (
    <section
      className="section section--journey"
      id="journey"
      ref={sectionRef}
    >
      <SectionReveal>
        <div className="shell">
          <div className="journey-card">
            <div className="journey-card__copy">
              <p className="section-eyebrow section-eyebrow--dark">
                {formatSectionLabel(content.eyebrow)}
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
                onPointerEnter={onPreloadJourney}
                onFocus={onPreloadJourney}
              >
                <span>{content.action}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>

            <figure className="journey-preview-visual" aria-label={content.previewLabel}>
              <div className="atlas-plate" aria-hidden="true">
                <img src={atlasImage} alt="" width={atlasViews.width} height={atlasViews.height} loading="lazy" decoding="async" />
                <svg viewBox={`0 0 ${atlasViews.width} ${atlasViews.height}`} focusable="false">
                  {atlasPins.map(pin => (
                    <circle key={pin.isoCode} cx={pin.x} cy={pin.y}
                      r={pin.tier === "chapter" ? 3.9 : 2.8}
                      className={`atlas-pin atlas-pin--${pin.tier}`} />
                  ))}
                </svg>
              </div>
              <figcaption>{content.orbitLabel}</figcaption>
            </figure>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
