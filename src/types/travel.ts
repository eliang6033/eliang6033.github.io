export type TravelStatus = "visited" | "lived" | "current";
export type TravelImportance = "home" | "extended-stay" | "visited";
export type TravelPlaceLayout = "default" | "wide";

/** Uppercase ISO 3166-1 alpha-3 country code, such as CHN or USA. */
export type IsoAlpha3Code = Uppercase<string>;

export interface TravelPlace {
  name: string;
  layout?: TravelPlaceLayout;
}

export interface TravelLocation {
  name: string;
  isoCode: IsoAlpha3Code;
  status: TravelStatus;
  importance: TravelImportance;
  year: string;
  highlight?: string;
  cities?: Array<string | TravelPlace>;
  description?: string;
  image?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TravelFocusRequest {
  isoCode: IsoAlpha3Code;
  requestId: number;
}

export interface TravelStat {
  label: string;
  value: string;
}
