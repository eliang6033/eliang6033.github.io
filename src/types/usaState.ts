export type USAStateCode =
  | "US-CA"
  | "US-WY"
  | "US-AZ"
  | "US-NV"
  | "US-WA"
  | "US-NY"
  | "US-AK"
  | "US-TX";

export interface USAStatePlace {
  code: USAStateCode;
  name: string;
  note?: string;
  sourceIdentifiers: readonly string[];
  aliases: readonly string[];
}

export interface USAOutlineDocument {
  viewBox: [number, number, number, number];
  contiguousPaths: string[];
  alaskaInset: {
    frame: [number, number, number, number];
  };
}

export interface USAStateShape {
  code: USAStateCode;
  zone: "contiguous" | "alaska";
  paths: string[];
  anchor: [number, number];
  label: [number, number];
  hitRadius: number;
}

export interface USAVisitedStatesDocument {
  states: USAStateShape[];
}

export interface USAMapData {
  outline: USAOutlineDocument;
  visitedStates: USAVisitedStatesDocument;
}
