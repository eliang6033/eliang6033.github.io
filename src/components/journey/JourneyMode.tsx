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
import type { ChinaRegionCode } from "../../types/chinaRegion";
import type {
  IsoAlpha3Code,
  TravelFocusRequest,
  TravelLocation,
} from "../../types/travel";
import { loadTravelGlobe } from "../../utils/preloadJourney";
import { CountryDetailsPanel } from "./CountryDetailsPanel";
import { GlobeLoadingState } from "./GlobeLoadingState";
import { StarBackground } from "./StarBackground";

const TravelGlobe = lazy(loadTravelGlobe);
const loadChinaRegionalMode = () => import("./china/ChinaRegionalMode");
const ChinaRegionalMode = lazy(loadChinaRegionalMode);

type JourneyView = "globe" | "china-transition" | "china";
const chinaIsoCode = "CHN";

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
  const chinaTransitionTimerRef = useRef<number>();
  const chinaRegionalReadyRef = useRef(false);
  const [selectedLocation, setSelectedLocation] =
    useState<TravelLocation | null>(null);
  const [focusRequest, setFocusRequest] =
    useState<TravelFocusRequest | null>(null);
  const [unavailableCountry, setUnavailableCountry] = useState<string | null>(
    null,
  );
  const [journeyView, setJourneyView] = useState<JourneyView>("globe");
  const [selectedChinaRegionCode, setSelectedChinaRegionCode] =
    useState<ChinaRegionCode | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
      window.clearTimeout(unavailableTimerRef.current);
    };
  }, [onClose]);

  const requestCountryFocus = useCallback((isoCode: IsoAlpha3Code) => {
    focusRequestCounterRef.current += 1;
    setFocusRequest({
      isoCode,
      requestId: focusRequestCounterRef.current,
    });
  }, []);

  const clearChinaTransition = useCallback(() => {
    window.clearTimeout(chinaTransitionTimerRef.current);
    chinaTransitionTimerRef.current = undefined;
  }, []);

  const handleSelectLocation = useCallback(
    (location: TravelLocation | null) => {
      clearChinaTransition();
      setSelectedLocation(location);

      if (!location) {
        setJourneyView("globe");
        return;
      }

      requestCountryFocus(location.isoCode);
      if (location.isoCode !== chinaIsoCode) {
        setJourneyView("globe");
        return;
      }

      setSelectedChinaRegionCode(null);
      setJourneyView("china-transition");
      void loadChinaRegionalMode()
        .then(({ preloadChinaRegionalMode }) => preloadChinaRegionalMode())
        .then(() => {
          chinaRegionalReadyRef.current = true;
        })
        .catch(() => undefined);
      const transitionDelay = chinaRegionalReadyRef.current
        ? reduceMotion
          ? 0
          : 140
        : reduceMotion
          ? 60
          : 680;
      chinaTransitionTimerRef.current = window.setTimeout(
        () => setJourneyView("china"),
        transitionDelay,
      );
    },
    [clearChinaTransition, reduceMotion, requestCountryFocus],
  );

  const handleBackToGlobe = useCallback(() => {
    clearChinaTransition();
    setSelectedChinaRegionCode(null);
    setSelectedLocation(null);
    setJourneyView("globe");
    requestCountryFocus(chinaIsoCode);
  }, [clearChinaTransition, requestCountryFocus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (journeyView === "china" && selectedChinaRegionCode) {
          setSelectedChinaRegionCode(null);
          return;
        }
        if (journeyView !== "globe") {
          handleBackToGlobe();
          return;
        }
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".journey-mode button:not([disabled]):not([tabindex='-1']), .journey-mode a[href], .journey-mode [role='button'][tabindex='0']",
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleBackToGlobe, journeyView, onClose, selectedChinaRegionCode]);

  useEffect(
    () => () => clearChinaTransition(),
    [clearChinaTransition],
  );

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
        {journeyView === "globe" ? <p>{content.instructions}</p> : null}
      </div>

      {journeyView !== "china" ? (
        <>
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
        </>
      ) : null}

      <AnimatePresence>
        {journeyView === "china" ? (
          <motion.div
            key="china-regional-mode"
            className="china-regional-stage"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.36 }}
          >
            <Suspense
              fallback={
                <ChinaRegionalLoadingShell onBack={handleBackToGlobe} />
              }
            >
              <ChinaRegionalMode
                selectedRegionCode={selectedChinaRegionCode}
                onSelectRegion={setSelectedChinaRegionCode}
                onBack={handleBackToGlobe}
              />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="journey-globe"
            className={`journey-globe-stage ${
              selectedLocation && selectedLocation.isoCode !== chinaIsoCode
                ? "journey-globe-stage--with-panel"
                : ""
            }`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
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
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {journeyView === "globe" &&
        selectedLocation &&
        selectedLocation.isoCode !== chinaIsoCode ? (
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

function ChinaRegionalLoadingShell({ onBack }: { onBack: () => void }) {
  const content = siteContent.chinaRegionalMode;
  return (
    <section className="china-regional-mode" aria-label={content.ariaLabel}>
      <div className="china-regional-mode__header">
        <button type="button" onClick={onBack} className="china-regional-back">
          <ArrowLeft aria-hidden="true" size={17} />
          <span>{content.backButton}</span>
        </button>
        <div>
          <p>{content.eyebrow}</p>
          <h2>{content.title}</h2>
        </div>
      </div>
      <div className="china-regional-suspense" role="status">
        <div aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p>{content.loading}</p>
      </div>
    </section>
  );
}
