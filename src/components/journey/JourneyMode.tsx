import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { siteContent, uiStatusText } from "../../config/siteContent";
import {
  keyChapterLocations,
  travelImportanceOrder,
  travelImportanceVisuals,
  travelMapContent,
} from "../../data/travel";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";
import type { TravelFocusRequest, TravelLocation } from "../../types/travel";
import { loadTravelGlobe } from "../../utils/preloadJourney";
import { CountryDetailsPanel } from "./CountryDetailsPanel";
import { GlobeLoadingState } from "./GlobeLoadingState";
import { StarBackground } from "./StarBackground";

const TravelGlobe = lazy(loadTravelGlobe);

interface JourneyModeProps {
  onClose: () => void;
}

export default function JourneyMode({ onClose }: JourneyModeProps) {
  const content = siteContent.journeyMode;
  const reduceMotion = useReducedMotionPreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusRequestCounterRef = useRef(0);
  const unavailableTimerRef = useRef<number>();
  const [selectedLocation, setSelectedLocation] =
    useState<TravelLocation | null>(null);
  const [focusRequest, setFocusRequest] =
    useState<TravelFocusRequest | null>(null);
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
          ".journey-mode button:not([disabled]):not([tabindex='-1']), .journey-mode a[href]",
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
      window.clearTimeout(unavailableTimerRef.current);
    };
  }, [onClose]);

  const handleSelectLocation = useCallback((location: TravelLocation | null) => {
    setSelectedLocation(location);
    if (!location) return;

    focusRequestCounterRef.current += 1;
    setFocusRequest({
      isoCode: location.isoCode,
      requestId: focusRequestCounterRef.current,
    });
  }, []);

  const showUnavailableCountry = useCallback((countryName: string) => {
    window.clearTimeout(unavailableTimerRef.current);
    setUnavailableCountry(countryName);
    unavailableTimerRef.current = window.setTimeout(
      () => setUnavailableCountry(null),
      2400,
    );
  }, []);

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

      <nav
        className="journey-key-chapters"
        aria-label={travelMapContent.keyChaptersLabel}
      >
        <span className="journey-key-chapters__label">
          {travelMapContent.keyChaptersLabel}
        </span>
        <div className="journey-key-chapters__links">
          {keyChapterLocations.map((location, index) => (
            <Fragment key={location.isoCode}>
              <button
                type="button"
                aria-pressed={selectedLocation?.isoCode === location.isoCode}
                onClick={() => handleSelectLocation(location)}
              >
                {location.name}
              </button>
              {index < keyChapterLocations.length - 1 ? (
                <span aria-hidden="true">
                  {travelMapContent.countryLabelSeparator}
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      </nav>

      <div
        className="journey-importance-legend"
        role="list"
        aria-label={travelMapContent.importanceLegendAriaLabel}
      >
        {travelImportanceOrder.map((importance) => {
          const visual = travelImportanceVisuals[importance];
          return (
            <span key={importance} role="listitem">
              <i
                aria-hidden="true"
                style={{ backgroundColor: visual.fill }}
              />
              {visual.label}
            </span>
          );
        })}
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
        <Suspense fallback={<GlobeLoadingState />}>
          <TravelGlobe
            selectedLocation={selectedLocation}
            focusRequest={focusRequest}
            onSelectLocation={handleSelectLocation}
            onUnavailableCountry={showUnavailableCountry}
          />
        </Suspense>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedLocation ? (
          <CountryDetailsPanel
            key={selectedLocation.isoCode}
            location={selectedLocation}
            onClose={() => handleSelectLocation(null)}
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
