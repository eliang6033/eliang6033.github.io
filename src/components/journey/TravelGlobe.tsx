import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { uiStatusText } from "../../config/siteContent";
import {
  travelLocationByIsoCode,
  travelLocationByNumericCode,
  travelMapContent,
} from "../../data/travel";
import type { TravelLocation } from "../../types/travel";

interface CountryProperties {
  name?: string;
  isoA3?: string;
  numericIsoCode?: string;
}

type CountryFeature = Feature<Geometry, CountryProperties> & {
  capColor?: string;
};

interface TravelGlobeProps {
  selectedLocation: TravelLocation | null;
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

function asCountryFeature(value: object): CountryFeature {
  return value as CountryFeature;
}

function getFeatureCode(feature: CountryFeature) {
  return (
    feature.properties.isoA3 ??
    feature.properties.numericIsoCode ??
    String(feature.id ?? "")
  );
}

function getLocation(feature: CountryFeature) {
  const code = getFeatureCode(feature);
  return (
    travelLocationByIsoCode.get(code) ??
    travelLocationByNumericCode.get(code) ??
    null
  );
}

function getFeatureName(feature: CountryFeature) {
  return feature.properties.name ?? travelMapContent.unknownCountryName;
}

function getBaseCapColor(feature: CountryFeature) {
  const location = getLocation(feature);
  if (location?.status === "current") return "#d7c66f";
  if (location?.status === "lived") return "#22b8cf";
  if (location?.status === "visited") return "#1493ad";
  return "#142235";
}

export function TravelGlobe({
  selectedLocation,
  onSelectLocation,
  onUnavailableCountry,
}: TravelGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods>();
  const resumeTimerRef = useRef<number>();
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [loadError, setLoadError] = useState(false);
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
  useEffect(
    () => () => globeMaterial.dispose(),
    [globeMaterial],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/countries.geojson", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json() as Promise<FeatureCollection<Geometry, CountryProperties>>;
      })
      .then((data) =>
        setCountries(
          data.features.map((feature) => ({
            ...feature,
            capColor: getBaseCapColor(feature),
          })),
        ),
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });

    return () => controller.abort();
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
    const globe = globeRef.current;
    if (!globe || countries.length === 0) return;

    const controls = globe.controls() as unknown as GlobeControls;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.36;
    controls.minDistance = 140;
    controls.maxDistance = 420;

    const pauseRotation = () => {
      controls.autoRotate = false;
      window.clearTimeout(resumeTimerRef.current);
    };

    const resumeRotationLater = () => {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 4200);
    };

    controls.addEventListener("start", pauseRotation);
    controls.addEventListener("end", resumeRotationLater);

    return () => {
      window.clearTimeout(resumeTimerRef.current);
      controls.removeEventListener("start", pauseRotation);
      controls.removeEventListener("end", resumeRotationLater);
    };
  }, [countries]);

  useEffect(() => {
    if (!selectedLocation || !globeRef.current) return;
    globeRef.current.pointOfView(
      {
        lat: selectedLocation.coordinates.lat,
        lng: selectedLocation.coordinates.lng,
        altitude: 1.85,
      },
      650,
    );
  }, [selectedLocation]);

  const ringData = useMemo(
    () =>
      Array.from(travelLocationByIsoCode.values())
        .filter((location) => location.status === "current")
        .map((location) => location.coordinates),
    [],
  );

  const polygonLabel = (object: object) => {
    const feature = asCountryFeature(object);
    const location = getLocation(feature);
    const status = location
      ? `${travelMapContent.countryLabelSeparator} ${location.years}`
      : "";
    return `<div class="globe-label"><strong>${getFeatureName(feature)}</strong><span>${status}</span></div>`;
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
          polygonCapColor="capColor"
          polygonSideColor={() => "rgba(5, 12, 24, 0.82)"}
          polygonStrokeColor={() => "rgba(123, 160, 190, 0.25)"}
          polygonAltitude={(object) => {
            const feature = asCountryFeature(object);
            const location = getLocation(feature);
            return selectedLocation?.isoCode === location?.isoCode
              ? 0.022
              : hoveredCode === getFeatureCode(feature)
                ? 0.014
              : location
                ? 0.012
                : 0.004;
          }}
          polygonLabel={polygonLabel}
          onPolygonHover={(object) =>
            setHoveredCode(object ? getFeatureCode(asCountryFeature(object)) : null)
          }
          onPolygonClick={handlePolygonClick}
          polygonsTransitionDuration={280}
          showAtmosphere
          atmosphereColor="#22d3ee"
          atmosphereAltitude={0.14}
          ringsData={ringData}
          ringLat={(point) => (point as { lat: number }).lat}
          ringLng={(point) => (point as { lng: number }).lng}
          ringColor={() => "#e8c66a"}
          ringMaxRadius={2.6}
          ringPropagationSpeed={0.55}
          ringRepeatPeriod={1850}
          animateIn={false}
        />
      ) : (
        <div className="globe-loading" role="status">
          <span aria-hidden="true" />
          <p>{loadError ? uiStatusText.countryDataError : uiStatusText.loadingCountries}</p>
        </div>
      )}
    </div>
  );
}
