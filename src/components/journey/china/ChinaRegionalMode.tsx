import { motion } from "framer-motion";
import { ArrowLeft, Map } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { siteContent } from "../../../config/siteContent";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import type {
  ChinaMapData,
  ChinaRegionCode,
} from "../../../types/chinaRegion";
import { ChinaPlacesList } from "./ChinaPlacesList";
import { ChinaRegionalMap } from "./ChinaRegionalMap";
import { loadChinaMapData, preloadChinaMapData } from "./loadChinaMap";

interface ChinaRegionalModeProps {
  selectedRegionCode: ChinaRegionCode | null;
  onSelectRegion: (code: ChinaRegionCode) => void;
  onBack: () => void;
}

export { preloadChinaMapData as preloadChinaRegionalMode };

export default function ChinaRegionalMode({
  selectedRegionCode,
  onSelectRegion,
  onBack,
}: ChinaRegionalModeProps) {
  const content = siteContent.chinaRegionalMode;
  const reduceMotion = useReducedMotionPreference();
  const [data, setData] = useState<ChinaMapData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hoveredRegionCode, setHoveredRegionCode] =
    useState<ChinaRegionCode | null>(null);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    loadChinaMapData()
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
      className="china-regional-mode"
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
            <ChinaRegionalMap
              data={data}
              selectedRegionCode={selectedRegionCode}
              hoveredRegionCode={hoveredRegionCode}
              onSelectRegion={onSelectRegion}
              onHoverRegion={setHoveredRegionCode}
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
          <ChinaPlacesList
            selectedRegionCode={selectedRegionCode}
            hoveredRegionCode={hoveredRegionCode}
            onSelectRegion={onSelectRegion}
            onHoverRegion={setHoveredRegionCode}
          />
        </aside>
      </div>
    </motion.section>
  );
}
