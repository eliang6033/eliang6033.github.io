import { preloadCountryFeatures } from "../data/countryGeometry";

let journeyModePromise: ReturnType<typeof importJourneyMode> | null = null;
let travelGlobePromise: ReturnType<typeof importTravelGlobe> | null = null;
let preloadStarted = false;

function importJourneyMode() {
  return import("../components/journey/JourneyMode");
}

function importTravelGlobe() {
  return import("../components/journey/TravelGlobe").then((module) => ({
    default: module.TravelGlobe,
  }));
}

export function loadJourneyMode() {
  if (!journeyModePromise) {
    journeyModePromise = importJourneyMode().catch((error: unknown) => {
      journeyModePromise = null;
      throw error;
    });
  }
  return journeyModePromise;
}

export function loadTravelGlobe() {
  if (!travelGlobePromise) {
    travelGlobePromise = importTravelGlobe().catch((error: unknown) => {
      travelGlobePromise = null;
      throw error;
    });
  }
  return travelGlobePromise;
}

export function preloadJourneyExperience() {
  if (preloadStarted) return;
  preloadStarted = true;

  void Promise.allSettled([
    loadJourneyMode(),
    loadTravelGlobe(),
    preloadCountryFeatures(),
  ]);
}
