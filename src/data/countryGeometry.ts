import type { Feature, FeatureCollection, Geometry } from "geojson";

export interface CountryProperties {
  name?: string;
  isoA3?: string;
}

export type CountryFeature = Feature<Geometry, CountryProperties>;

const countryDataUrl = "/data/countries.geojson";

let cachedCountryFeatures: CountryFeature[] | null = null;
let countryFeaturesPromise: Promise<CountryFeature[]> | null = null;

export function loadCountryFeatures(): Promise<CountryFeature[]> {
  if (cachedCountryFeatures) return Promise.resolve(cachedCountryFeatures);

  if (!countryFeaturesPromise) {
    countryFeaturesPromise = fetch(countryDataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json() as Promise<
          FeatureCollection<Geometry, CountryProperties>
        >;
      })
      .then((data) => {
        cachedCountryFeatures = data.features;
        return cachedCountryFeatures;
      })
      .catch((error: unknown) => {
        countryFeaturesPromise = null;
        throw error;
      });
  }

  return countryFeaturesPromise;
}

export function preloadCountryFeatures() {
  return loadCountryFeatures().then(() => undefined);
}
