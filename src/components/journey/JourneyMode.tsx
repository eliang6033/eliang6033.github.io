import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { siteContent, uiStatusText } from "../../config/siteContent";
import {
  getTravelMapTier,
  travelLocations,
  travelMapTierOrder,
  travelMapVisuals,
  travelMapContent,
} from "../../data/travel";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";
import type { ChinaRegionCode } from "../../types/chinaRegion";
import type { USAStateCode } from "../../types/usaState";
import type {
  IsoAlpha3Code,
  TravelFocusRequest,
  TravelLocation,
} from "../../types/travel";
import { loadTravelGlobe } from "../../utils/preloadJourney";
import { CountryDetailsPanel } from "./CountryDetailsPanel";
import { GlobeLoadingState } from "./GlobeLoadingState";
import { StarBackground } from "./StarBackground";
import "../../styles/journey-directory.css";

const TravelGlobe = lazy(loadTravelGlobe);
const loadChinaRegionalMode = () => import("./china/ChinaRegionalMode");
const ChinaRegionalMode = lazy(loadChinaRegionalMode);
const loadUSARegionalMode = () => import("./usa/USARegionalMode");
const USARegionalMode = lazy(loadUSARegionalMode);

type JourneyView =
  | "globe"
  | "china-transition"
  | "china"
  | "usa-transition"
  | "usa";
const chinaIsoCode = "CHN";
const usaIsoCode = "USA";
const directoryLocations = travelMapTierOrder.flatMap(tier =>
  travelLocations.filter(location => getTravelMapTier(location) === tier),
);

interface JourneyModeProps {
  onClose: () => void;
}

export default function JourneyMode({ onClose }: JourneyModeProps) {
  const content = siteContent.journeyMode;
  const reduceMotion = useReducedMotionPreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const directoryRef = useRef<HTMLElement>(null);
  const directoryToggleRef = useRef<HTMLButtonElement>(null);
  const keyboardReturnCountry = useRef<IsoAlpha3Code | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusRequestCounterRef = useRef(0);
  const unavailableTimerRef = useRef<number>();
  const chinaTransitionTimerRef = useRef<number>();
  const chinaRegionalReadyRef = useRef(false);
  const usaTransitionTimerRef = useRef<number>();
  const usaRegionalReadyRef = useRef(false);
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
  const [selectedUSAStateCode, setSelectedUSAStateCode] =
    useState<USAStateCode | null>(null);

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

  const clearUSATransition = useCallback(() => {
    window.clearTimeout(usaTransitionTimerRef.current);
    usaTransitionTimerRef.current = undefined;
  }, []);

  const handleSelectLocation = useCallback(
    (location: TravelLocation | null) => {
      clearChinaTransition();
      clearUSATransition();
      setSelectedLocation(location);
      setDirectoryOpen(false);

      if (!location) {
        setJourneyView("globe");
        return;
      }

      requestCountryFocus(location.isoCode);
      if (location.isoCode === chinaIsoCode) {
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
        return;
      }

      if (location.isoCode === usaIsoCode) {
        setSelectedUSAStateCode(null);
        setJourneyView("usa-transition");
        void loadUSARegionalMode()
          .then(({ preloadUSARegionalMode }) => preloadUSARegionalMode())
          .then(() => {
            usaRegionalReadyRef.current = true;
          })
          .catch(() => undefined);
        const transitionDelay = usaRegionalReadyRef.current
          ? reduceMotion
            ? 0
            : 140
          : reduceMotion
            ? 60
            : 680;
        usaTransitionTimerRef.current = window.setTimeout(
          () => setJourneyView("usa"),
          transitionDelay,
        );
        return;
      }

      setJourneyView("globe");
    },
    [
      clearChinaTransition,
      clearUSATransition,
      reduceMotion,
      requestCountryFocus,
    ],
  );

  const handleBackFromChina = useCallback(() => {
    clearChinaTransition();
    clearUSATransition();
    setSelectedChinaRegionCode(null);
    setSelectedLocation(null);
    setJourneyView("globe");
    requestCountryFocus(chinaIsoCode);
  }, [clearChinaTransition, clearUSATransition, requestCountryFocus]);

  const handleBackFromUSA = useCallback(() => {
    clearChinaTransition();
    clearUSATransition();
    setSelectedUSAStateCode(null);
    setSelectedLocation(null);
    setJourneyView("globe");
    requestCountryFocus(usaIsoCode);
  }, [clearChinaTransition, clearUSATransition, requestCountryFocus]);

  // A keyboard choice can replace the focused country button with another view.
  // Keep focus in the dialog and return to that country (or its compact menu).
  useEffect(() => {
    const iso = keyboardReturnCountry.current;
    if (!iso) return;
    if (journeyView !== "globe") {
      closeButtonRef.current?.focus({ preventScroll: true });
      return;
    }
    if (selectedLocation) {
      const close = document.querySelector<HTMLButtonElement>(".journey-mode .country-panel__close");
      (close ?? directoryToggleRef.current)?.focus({ preventScroll: true });
      return;
    }
    const row = directoryRef.current?.querySelector<HTMLButtonElement>(`button[data-country="${iso}"]`);
    (row?.getClientRects().length ? row : directoryToggleRef.current)?.focus();
    keyboardReturnCountry.current = null;
  }, [journeyView, selectedLocation]);

  useEffect(() => {
    if (!directoryOpen) return;
    const dismissOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !directoryRef.current?.contains(event.target)) {
        setDirectoryOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismissOnOutsidePress);
    return () => document.removeEventListener("pointerdown", dismissOnOutsidePress);
  }, [directoryOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (directoryOpen && directoryToggleRef.current?.getClientRects().length) {
          setDirectoryOpen(false);
          directoryToggleRef.current.focus();
          return;
        }
        if (journeyView === "china" && selectedChinaRegionCode) {
          setSelectedChinaRegionCode(null);
          return;
        }
        if (journeyView === "usa" && selectedUSAStateCode) {
          setSelectedUSAStateCode(null);
          return;
        }
        if (journeyView === "china" || journeyView === "china-transition") {
          handleBackFromChina();
          return;
        }
        if (journeyView === "usa" || journeyView === "usa-transition") {
          handleBackFromUSA();
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
      ).filter(element => element.getClientRects().length > 0 && !element.closest("[inert]"));
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
  }, [
    directoryOpen,
    handleBackFromChina,
    handleBackFromUSA,
    journeyView,
    onClose,
    selectedChinaRegionCode,
    selectedUSAStateCode,
  ]);

  useEffect(
    () => () => {
      clearChinaTransition();
      clearUSATransition();
    },
    [clearChinaTransition, clearUSATransition],
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
      </div>

      {journeyView === "globe" ? (
        <>
          <nav
            ref={directoryRef}
            className="journey-directory"
            data-open={directoryOpen}
            data-detail={Boolean(selectedLocation)}
            aria-label={travelMapContent.countryListLabel}
          >
            <button
              type="button"
              ref={directoryToggleRef}
              className="journey-directory__toggle"
              aria-label={travelMapContent.countryListLabel}
              aria-expanded={directoryOpen}
              aria-controls="journey-country-list"
              onClick={() => {
                if (selectedLocation) {
                  keyboardReturnCountry.current = selectedLocation.isoCode;
                  handleSelectLocation(null);
                }
                setDirectoryOpen(!directoryOpen);
              }}
            >
              {travelMapContent.countryListToggleLabel}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            <div className="journey-directory__index" id="journey-country-list">
              <p className="journey-directory__heading">
                {travelMapContent.countryListLabel}
                <span>{directoryLocations.length}</span>
              </p>
              <ul>
                {directoryLocations.map(location => {
                  const tier = getTravelMapTier(location);
                  return (
                    <li key={location.isoCode} data-tier={tier}>
                      <button
                        type="button"
                        data-country={location.isoCode}
                        style={{ color: travelMapVisuals[tier].border }}
                        onClick={event => {
                          keyboardReturnCountry.current = event.detail === 0 ? location.isoCode : null;
                          handleSelectLocation(location);
                        }}
                      >
                        <i aria-hidden="true" />
                        {location.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="journey-map-key">
            <div
              className="journey-map-key__tiers"
              role="list"
              aria-label={travelMapContent.importanceLegendAriaLabel}
            >
              {travelMapTierOrder.map(tier => {
                const visual = travelMapVisuals[tier];
                return (
                  <span key={tier} role="listitem">
                    <i aria-hidden="true" style={{ backgroundColor: visual.border }} />
                    {visual.label}
                  </span>
                );
              })}
            </div>
            <p>{content.instructions}</p>
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
                <ChinaRegionalLoadingShell onBack={handleBackFromChina} />
              }
            >
              <ChinaRegionalMode
                selectedRegionCode={selectedChinaRegionCode}
                onSelectRegion={setSelectedChinaRegionCode}
                onBack={handleBackFromChina}
              />
            </Suspense>
          </motion.div>
        ) : journeyView === "usa" ? (
          <motion.div
            key="usa-regional-mode"
            className="china-regional-stage usa-regional-stage"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.36 }}
          >
            <Suspense
              fallback={<USARegionalLoadingShell onBack={handleBackFromUSA} />}
            >
              <USARegionalMode
                selectedStateCode={selectedUSAStateCode}
                onSelectState={setSelectedUSAStateCode}
                onBack={handleBackFromUSA}
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
            onClose={() => {
              if (document.activeElement?.closest(".country-panel")) {
                keyboardReturnCountry.current = selectedLocation.isoCode;
              }
              handleSelectLocation(null);
            }}
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

function USARegionalLoadingShell({ onBack }: { onBack: () => void }) {
  const content = siteContent.usaRegionalMode;
  return (
    <section
      className="china-regional-mode usa-regional-mode"
      aria-label={content.ariaLabel}
    >
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
