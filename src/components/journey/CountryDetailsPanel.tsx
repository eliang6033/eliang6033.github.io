import { MapPin, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { siteContent } from "../../config/siteContent";
import { travelStatusLabels } from "../../data/travel";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";
import type { TravelLocation } from "../../types/travel";

interface CountryDetailsPanelProps {
  location: TravelLocation;
  onClose: () => void;
}

export function CountryDetailsPanel({
  location,
  onClose,
}: CountryDetailsPanelProps) {
  const content = siteContent.journeyMode;
  const reduceMotion = useReducedMotionPreference();
  const [showImage, setShowImage] = useState(Boolean(location.image));
  const places = location.cities?.map((place) =>
    typeof place === "string" ? { name: place } : place,
  );
  const usesPlacesGrid = location.cities?.some(
    (place) => typeof place !== "string",
  );

  return (
    <motion.aside
      className={`country-panel ${showImage ? "country-panel--with-image" : ""}`}
      aria-label={`${content.selectedCountryLabel}: ${location.name}`}
      initial={reduceMotion ? false : { opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: 32 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        className="country-panel__close"
        type="button"
        onClick={onClose}
        aria-label={content.closeDetails}
      >
        <X aria-hidden="true" size={19} />
      </button>

      {showImage && location.image ? (
        <div className="country-panel__photo">
          <img
            src={location.image}
            alt=""
            onError={() => setShowImage(false)}
          />
        </div>
      ) : null}

      <div className="country-panel__header">
        <p>{travelStatusLabels[location.status]}</p>
        <h2>{location.name}</h2>
        <span>{location.year}</span>
      </div>

      {location.highlight ? <h3>{location.highlight}</h3> : null}
      {location.description ? (
        <p className="country-panel__description">{location.description}</p>
      ) : null}

      {places?.length ? (
        <div
          className={
            usesPlacesGrid
              ? "country-panel__cities country-panel__cities--grid"
              : "country-panel__cities"
          }
        >
          <p>{content.citiesTitle}</p>
          <ul>
            {places.map((place) => (
              <li
                key={place.name}
                className={
                  place.layout === "wide"
                    ? "country-panel__place-card--wide"
                    : undefined
                }
              >
                <MapPin aria-hidden="true" size={14} />
                <span>{place.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.aside>
  );
}
