import type { TravelLocation, TravelStat, TravelStatus } from "../types/travel";

export const travelLocations: TravelLocation[] = [
  {
    country: "China",
    isoCode: "CHN",
    numericIsoCode: "156",
    status: "lived",
    years: "Childhood",
    highlight: "Where the journey began",
    cities: ["Hainan", "Placeholder City"],
    description:
      "The starting point of my story and an important part of how I understand home, culture, and change.",
    coordinates: { lat: 35.86, lng: 104.2 },
    regions: [{ name: "Hainan", cities: ["Placeholder City"] }],
  },
  {
    country: "United States",
    isoCode: "USA",
    numericIsoCode: "840",
    status: "lived",
    years: "Student years",
    highlight: "Education and growth",
    cities: ["San Diego", "San Jose", "Los Angeles"],
    description:
      "A major chapter shaped by education, research, friendships, and new opportunities.",
    coordinates: { lat: 37.09, lng: -95.71 },
    regions: [
      {
        name: "California",
        cities: ["San Diego", "San Jose", "Los Angeles"],
      },
    ],
  },
  {
    country: "Singapore",
    isoCode: "SGP",
    numericIsoCode: "702",
    status: "current",
    years: "2026",
    highlight: "First international research internship",
    cities: ["Singapore"],
    description:
      "A new chapter combining research, independence, and the experience of living and working abroad.",
    coordinates: { lat: 1.35, lng: 103.82 },
    regions: [{ name: "Singapore", cities: ["Singapore"] }],
  },
];

export const visitedCountryCodes = travelLocations.map(
  ({ isoCode }) => isoCode,
);

export const travelStats: TravelStat[] = [
  { label: "Countries Visited", value: "13" },
  { label: "Places Lived", value: "3" },
  { label: "Current Chapter", value: "Singapore" },
];

export const travelStatusLabels: Record<TravelStatus, string> = {
  visited: "Visited",
  lived: "Lived",
  current: "Current chapter",
};

export const travelMapContent = {
  unknownCountryName: "Unknown country",
  countryLabelSeparator: "·",
} as const;

export const travelLocationByNumericCode = new Map(
  travelLocations.map((location) => [location.numericIsoCode, location]),
);

export const travelLocationByIsoCode = new Map(
  travelLocations.map((location) => [location.isoCode, location]),
);
