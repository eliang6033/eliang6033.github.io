import { motion } from "framer-motion";
import { ArrowLeft, Map } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { siteContent } from "../../../config/siteContent";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import type { USAMapData, USAStateCode } from "../../../types/usaState";
import { USAPlacesList } from "./USAPlacesList";
import { USARegionalMap } from "./USARegionalMap";
import { loadUSAMapData, preloadUSAMapData } from "./loadUSAMap";

interface USARegionalModeProps {
  selectedStateCode: USAStateCode | null;
  onSelectState: (code: USAStateCode) => void;
  onBack: () => void;
}

export { preloadUSAMapData as preloadUSARegionalMode };

export default function USARegionalMode({
  selectedStateCode,
  onSelectState,
  onBack,
}: USARegionalModeProps) {
  const content = siteContent.usaRegionalMode;
  const reduceMotion = useReducedMotionPreference();
  const [data, setData] = useState<USAMapData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hoveredStateCode, setHoveredStateCode] =
    useState<USAStateCode | null>(null);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    loadUSAMapData()
      .then((loadedData) => {
        if (active) setData(loadedData);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const retry = useCallback(() => {
    setLoadError(false);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  return (
    <motion.section
      className="china-regional-mode usa-regional-mode"
      aria-label={content.ariaLabel}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.975 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
      transition={{
        duration: reduceMotion ? 0 : 0.44,
        ease: [0.22, 1, 0.36, 1],
      }}
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

      <div className="china-regional-mode__layout">
        <div className="china-regional-mode__map-frame">
          {data ? (
            <USARegionalMap
              data={data}
              selectedStateCode={selectedStateCode}
              hoveredStateCode={hoveredStateCode}
              onSelectState={onSelectState}
              onHoverState={setHoveredStateCode}
            />
          ) : (
            <div className="china-regional-loading" role="status">
              <Map aria-hidden="true" size={54} strokeWidth={1.1} />
              <p>{loadError ? content.loadError : content.loading}</p>
              {loadError ? (
                <button type="button" onClick={retry}>
                  {content.retry}
                </button>
              ) : null}
            </div>
          )}
        </div>

        <aside className="china-regional-mode__places">
          <p>{content.placesLabel}</p>
          <USAPlacesList
            selectedStateCode={selectedStateCode}
            hoveredStateCode={hoveredStateCode}
            onSelectState={onSelectState}
            onHoverState={setHoveredStateCode}
          />
        </aside>
      </div>
    </motion.section>
  );
}
