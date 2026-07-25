import type {
  TravelImportance,
  TravelLocation,
  TravelStat,
  TravelStatus,
} from "../types/travel";

export const travelLocations: TravelLocation[] = [
  {
    name: "China",
    isoCode: "CHN",
    status: "lived",
    importance: "home",
    year: "2007–2019",
    highlight: "Where the journey began",
    cities: ["Hainan", "Placeholder City"],
    description:
      "The starting point of my story and an important part of how I understand home, culture, and change.",
    coordinates: { lat: 35.86, lng: 104.2 },
  },
  {
    name: "United States",
    isoCode: "USA",
    status: "lived",
    importance: "home",
    year: "2010–Present",
    highlight: "Education and growth",
    cities: ["San Diego", "San Jose", "Los Angeles"],
    description:
      "A major chapter shaped by education, research, friendships, and new opportunities.",
    coordinates: { lat: 37.09, lng: -95.71 },
  },
  {
    name: "Singapore",
    isoCode: "SGP",
    status: "visited",
    importance: "extended-stay",
    year: "2026",
    highlight: "Second international internship (World Action Model)",
    cities: ["Nanyang Technological University", "Ropedia"],
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    name: "Japan",
    isoCode: "JPN",
    status: "visited",
    importance: "visited",
    year: "2016",
    coordinates: { lat: 36.2, lng: 138.25 },
  },
  {
    name: "Denmark",
    isoCode: "DNK",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 56.26, lng: 9.5 },
  },
  {
    name: "Germany",
    isoCode: "DEU",
    status: "visited",
    importance: "extended-stay",
    year: "2025",
    highlight: "First international internship (Full Stack development)",
    cities: [
      { name: "Technische Universität Berlin", layout: "wide" },
      { name: "Berlin" },
      { name: "München" },
      { name: "Hamburg" },
      { name: "Frankfurt" },
      { name: "Köln" },
      { name: "Berchtesgaden" },
    ],
    description:
      "A new chapter combining research, independence, and the experience of living and working abroad.",
    coordinates: { lat: 51.17, lng: 10.45 },
  },
  {
    name: "Austria",
    isoCode: "AUT",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 47.52, lng: 14.55 },
  },
  {
    name: "Poland",
    isoCode: "POL",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 51.92, lng: 19.15 },
  },
  {
    name: "France",
    isoCode: "FRA",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 46.23, lng: 2.21 },
  },
  {
    name: "Netherlands",
    isoCode: "NLD",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 52.13, lng: 5.29 },
  },
  {
    name: "Canada",
    isoCode: "CAN",
    status: "visited",
    importance: "visited",
    year: "2018",
    coordinates: { lat: 56.13, lng: -106.35 },
  },
  {
    name: "Switzerland",
    isoCode: "CHE",
    status: "visited",
    importance: "visited",
    year: "2025",
    coordinates: { lat: 46.82, lng: 8.23 },
  },
  {
    name: "Mexico",
    isoCode: "MEX",
    status: "visited",
    importance: "visited",
    year: "2024",
    coordinates: { lat: 23.63, lng: -102.55 },
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
  importanceLegendAriaLabel: "Travel importance legend",
  keyChaptersLabel: "Key Chapters",
  singaporeBeaconLabel: "Singapore",
  singaporeBeaconAriaLabel: "Open Singapore travel details",
} as const;

export const travelLocationByIsoCode = new Map<string, TravelLocation>(
  travelLocations.map((location) => [location.isoCode, location]),
);

export const travelImportanceVisuals = {
  home: {
    label: "Home chapters",
    fill: "#22C7E5",
    border: "#67E8F9",
  },
  "extended-stay": {
    label: "Extended stays",
    fill: "#D9A73E",
    border: "#F0CF72",
  },
  visited: {
    label: "Visited",
    fill: "#1B6277",
    border: "#287F96",
  },
} as const satisfies Record<
  TravelImportance,
  { label: string; fill: string; border: string }
>;

export const unvisitedCountryColor = "#142236";

export const travelImportanceOrder: TravelImportance[] = [
  "home",
  "extended-stay",
  "visited",
];

export const keyChapterIsoCodes = ["CHN", "USA", "SGP", "DEU"] as const;

export const keyChapterLocations = keyChapterIsoCodes.map((isoCode) => {
  const location = travelLocationByIsoCode.get(isoCode);
  if (!location) {
    throw new Error(`Missing key chapter travel data for ${isoCode}`);
  }
  return location;
});

export const singaporeBeacon = {
  isoCode: "SGP",
  latitude: 1.3521,
  longitude: 103.8198,
} as const;
