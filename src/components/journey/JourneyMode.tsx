import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteContent, uiStatusText } from "../../config/siteContent";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";
import type { TravelLocation } from "../../types/travel";
import { CountryDetailsPanel } from "./CountryDetailsPanel";
import { StarBackground } from "./StarBackground";
import { TravelGlobe } from "./TravelGlobe";

interface JourneyModeProps {
  onClose: () => void;
}

export default function JourneyMode({ onClose }: JourneyModeProps) {
  const content = siteContent.journeyMode;
  const reduceMotion = useReducedMotionPreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<TravelLocation | null>(null);
  const [unavailableCountry, setUnavailableCountry] = useState<string | null>(
    null,
  );

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".journey-mode button:not([disabled]), .journey-mode a[href]",
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const showUnavailableCountry = (countryName: string) => {
    setUnavailableCountry(countryName);
    window.setTimeout(() => setUnavailableCountry(null), 2400);
  };

  return (
    <motion.div
      className="journey-mode"
      role="dialog"
      aria-modal="true"
      aria-label={content.ariaLabel}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.42 }}
    >
      <StarBackground />
      <div className="journey-mode__topbar">
        <button
          className="journey-back"
          type="button"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label={content.backButtonAria}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span>{content.backButton}</span>
        </button>
        <p>{content.instructions}</p>
      </div>

      <motion.div
        className={`journey-globe-stage ${
          selectedLocation ? "journey-globe-stage--with-panel" : ""
        }`}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          delay: reduceMotion ? 0 : 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <TravelGlobe
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onUnavailableCountry={showUnavailableCountry}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedLocation ? (
          <CountryDetailsPanel
            key={selectedLocation.isoCode}
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {unavailableCountry ? (
          <motion.div
            className="country-toast"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <strong>{unavailableCountry}</strong>
            <span>{uiStatusText.notVisited}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
