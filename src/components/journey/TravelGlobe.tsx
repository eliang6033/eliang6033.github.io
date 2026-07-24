import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import {
  loadCountryFeatures,
  type CountryFeature,
} from "../../data/countryGeometry";
import {
  singaporeBeacon,
  travelImportanceVisuals,
  travelLocationByIsoCode,
  travelMapContent,
  unvisitedCountryColor,
} from "../../data/travel";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";
import type {
  TravelFocusRequest,
  TravelImportance,
  TravelLocation,
} from "../../types/travel";
import { GlobeLoadingState } from "./GlobeLoadingState";

interface TravelGlobeProps {
  selectedLocation: TravelLocation | null;
  focusRequest: TravelFocusRequest | null;
  onSelectLocation: (location: TravelLocation | null) => void;
  onUnavailableCountry: (countryName: string) => void;
}

interface GlobeControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
  minDistance: number;
  maxDistance: number;
  addEventListener: (event: string, listener: () => void) => void;
  removeEventListener: (event: string, listener: () => void) => void;
}

const importanceAltitude: Record<TravelImportance, number> = {
  home: 0.015,
  "extended-stay": 0.012,
  visited: 0.009,
};

function asCountryFeature(value: object): CountryFeature {
  return value as CountryFeature;
}

function getFeatureCode(feature: CountryFeature) {
  return feature.properties.isoA3 ?? String(feature.id ?? "");
}

function getLocation(feature: CountryFeature) {
  const code = getFeatureCode(feature);
  return travelLocationByIsoCode.get(code) ?? null;
}

function getFeatureName(feature: CountryFeature) {
  return feature.properties.name ?? travelMapContent.unknownCountryName;
}

function brightenHexColor(hexColor: string, amount: number) {
  const color = hexColor.replace("#", "");
  const channels = [0, 2, 4].map((index) =>
    Number.parseInt(color.slice(index, index + 2), 16),
  );
  return `#${channels
    .map((channel) =>
      Math.round(channel + (255 - channel) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export function TravelGlobe({
  selectedLocation,
  focusRequest,
  onSelectLocation,
  onUnavailableCountry,
}: TravelGlobeProps) {
  const reduceMotion = useReducedMotionPreference();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods>();
  const controlsRef = useRef<GlobeControls | null>(null);
  const resumeTimerRef = useRef<number>();
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 640, height: 640 });
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: "#07121f",
        emissive: "#020617",
        emissiveIntensity: 0.18,
        shininess: 0.35,
      }),
    [],
  );
  const beaconData = useMemo(() => [singaporeBeacon], []);

  const clearResumeTimer = useCallback(() => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = undefined;
  }, []);

  const resumeRotationLater = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      if (controlsRef.current) controlsRef.current.autoRotate = true;
    }, 7000);
  }, [clearResumeTimer]);

  const pauseRotation = useCallback(
    (resumeLater: boolean) => {
      if (controlsRef.current) controlsRef.current.autoRotate = false;
      clearResumeTimer();
      if (resumeLater) resumeRotationLater();
    },
    [clearResumeTimer, resumeRotationLater],
  );

  useEffect(
    () => () => globeMaterial.dispose(),
    [globeMaterial],
  );

  useEffect(() => {
    let active = true;
    setLoadError(false);

    loadCountryFeatures()
      .then((features) => {
        if (active) setCountries(features);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const retryCountryData = useCallback(() => {
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setSize({
        width: Math.max(280, Math.round(rect.width)),
        height: Math.max(280, Math.round(rect.height)),
      });
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    updateSize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleBeaconClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const beacon = target.closest<HTMLElement>("[data-country-beacon]");
      if (!beacon) return;

      event.preventDefault();
      event.stopPropagation();
      const location = travelLocationByIsoCode.get(
        beacon.dataset.countryBeacon ?? "",
      );
      if (location) onSelectLocation(location);
    };

    container.addEventListener("click", handleBeaconClick, true);
    return () => container.removeEventListener("click", handleBeaconClick, true);
  }, [onSelectLocation]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || countries.length === 0) return;

    const controls = globe.controls() as unknown as GlobeControls;
    controlsRef.current = controls;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.36;
    controls.minDistance = 140;
    controls.maxDistance = 420;

    const handleInteractionStart = () => pauseRotation(false);
    const handleInteractionEnd = () => resumeRotationLater();

    controls.addEventListener("start", handleInteractionStart);
    controls.addEventListener("end", handleInteractionEnd);

    return () => {
      clearResumeTimer();
      controls.removeEventListener("start", handleInteractionStart);
      controls.removeEventListener("end", handleInteractionEnd);
      if (controlsRef.current === controls) controlsRef.current = null;
    };
  }, [clearResumeTimer, countries.length, pauseRotation, resumeRotationLater]);

  useEffect(() => {
    if (!focusRequest || !globeRef.current || countries.length === 0) return;
    const location = travelLocationByIsoCode.get(focusRequest.isoCode);
    if (!location) return;

    pauseRotation(true);
    globeRef.current.pointOfView(
      {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        altitude: location.isoCode === singaporeBeacon.isoCode ? 1.62 : 1.78,
      },
      reduceMotion ? 0 : 720,
    );
  }, [countries.length, focusRequest, pauseRotation, reduceMotion]);

  const polygonLabel = (object: object) => {
    const feature = asCountryFeature(object);
    const location = getLocation(feature);
    if (!location) return "";

    const highlight = location.highlight
      ? `<small>${escapeHtml(location.highlight)}</small>`
      : "";
    return `<div class="globe-label"><strong>${escapeHtml(location.name)}</strong><span>${travelMapContent.countryLabelSeparator} ${escapeHtml(location.year)}</span>${highlight}</div>`;
  };

  const handlePolygonClick = (object: object) => {
    const feature = asCountryFeature(object);
    const location = getLocation(feature);
    if (location) {
      onSelectLocation(location);
      return;
    }
    onSelectLocation(null);
    onUnavailableCountry(getFeatureName(feature));
  };

  const createSingaporeBeacon = useCallback(() => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `singapore-beacon${reduceMotion ? " singapore-beacon--static" : ""}`;
    button.setAttribute("aria-label", travelMapContent.singaporeBeaconAriaLabel);
    button.dataset.countryBeacon = singaporeBeacon.isoCode;

    const target = document.createElement("span");
    target.className = "singapore-beacon__target";
    target.setAttribute("aria-hidden", "true");

    const pulse = document.createElement("span");
    pulse.className = "singapore-beacon__pulse";
    target.append(pulse);

    const label = document.createElement("span");
    label.className = "singapore-beacon__label";
    label.textContent = travelMapContent.singaporeBeaconLabel;

    button.append(target, label);
    return button;
  }, [reduceMotion]);

  const updateBeaconVisibility = useCallback(
    (element: HTMLElement, isVisible: boolean) => {
      element.style.opacity = isVisible ? "1" : "0";
      element.style.pointerEvents = isVisible ? "auto" : "none";
      element.setAttribute("aria-hidden", isVisible ? "false" : "true");
      element.tabIndex = isVisible ? 0 : -1;
    },
    [],
  );

  return (
    <div className="travel-globe" ref={containerRef}>
      {countries.length > 0 ? (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          polygonsData={countries}
          polygonCapColor={(object) => {
            const feature = asCountryFeature(object);
            const location = getLocation(feature);
            const baseColor = location
              ? travelImportanceVisuals[location.importance].fill
              : unvisitedCountryColor;
            if (selectedLocation?.isoCode === location?.isoCode) {
              return brightenHexColor(baseColor, 0.17);
            }
            if (hoveredCode === getFeatureCode(feature)) {
              return brightenHexColor(baseColor, 0.09);
            }
            return baseColor;
          }}
          polygonSideColor={() => "rgba(5, 12, 24, 0.82)"}
          polygonStrokeColor={(object) => {
            const feature = asCountryFeature(object);
            const location = getLocation(feature);
            if (!location) return "rgba(69, 98, 126, 0.38)";
            const borderColor = travelImportanceVisuals[location.importance].border;
            if (selectedLocation?.isoCode === location.isoCode) {
              return brightenHexColor(borderColor, 0.16);
            }
            if (hoveredCode === getFeatureCode(feature)) {
              return brightenHexColor(borderColor, 0.07);
            }
            return borderColor;
          }}
          polygonAltitude={(object) => {
            const feature = asCountryFeature(object);
            const location = getLocation(feature);
            const baseAltitude = location
              ? importanceAltitude[location.importance]
              : 0.004;
            if (selectedLocation?.isoCode === location?.isoCode) {
              return baseAltitude + 0.008;
            }
            if (hoveredCode === getFeatureCode(feature)) {
              return baseAltitude + 0.003;
            }
            return baseAltitude;
          }}
          polygonLabel={polygonLabel}
          onPolygonHover={(object) =>
            setHoveredCode(
              object ? getFeatureCode(asCountryFeature(object)) : null,
            )
          }
          onPolygonClick={handlePolygonClick}
          polygonsTransitionDuration={280}
          htmlElementsData={beaconData}
          htmlLat="latitude"
          htmlLng="longitude"
          htmlAltitude={() => 0.018}
          htmlElement={createSingaporeBeacon}
          htmlElementVisibilityModifier={updateBeaconVisibility}
          htmlTransitionDuration={0}
          showAtmosphere
          atmosphereColor="#22d3ee"
          atmosphereAltitude={0.14}
          animateIn={false}
        />
      ) : (
        <GlobeLoadingState
          error={loadError}
          onRetry={loadError ? retryCountryData : undefined}
        />
      )}
    </div>
  );
}
