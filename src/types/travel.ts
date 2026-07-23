export type TravelStatus = "visited" | "lived" | "current";

export interface TravelLocation {
  country: string;
  isoCode: string;
  numericIsoCode: string;
  status: TravelStatus;
  years: string;
  highlight: string;
  cities: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  regions?: Array<{
    name: string;
    cities: string[];
  }>;
}

export interface TravelStat {
  label: string;
  value: string;
}
