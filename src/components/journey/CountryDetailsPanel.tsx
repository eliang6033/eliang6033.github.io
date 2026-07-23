import { MapPin, X } from "lucide-react";
import { motion } from "framer-motion";
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

  return (
    <motion.aside
      className="country-panel"
      aria-label={`${content.selectedCountryLabel}: ${location.country}`}
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

      <div className="country-panel__photo" aria-label={content.photoPlaceholder}>
        <span>{location.isoCode}</span>
        <p>{content.photoPlaceholder}</p>
      </div>

      <div className="country-panel__header">
        <p>{travelStatusLabels[location.status]}</p>
        <h2>{location.country}</h2>
        <span>{location.years}</span>
      </div>

      <h3>{location.highlight}</h3>
      <p className="country-panel__description">{location.description}</p>

      <div className="country-panel__cities">
        <p>{content.citiesTitle}</p>
        <ul>
          {location.cities.map((city) => (
            <li key={city}>
              <MapPin aria-hidden="true" size={14} />
              <span>{city}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="country-panel__future">{content.regionalNote}</p>
    </motion.aside>
  );
}
