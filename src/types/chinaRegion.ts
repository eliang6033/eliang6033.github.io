export type ChinaRegionCode =
  | "CN-XJ"
  | "CN-HL"
  | "CN-BJ"
  | "CN-SH"
  | "CN-CQ"
  | "CN-GD"
  | "CN-HI"
  | "CN-HK"
  | "CN-FJ"
  | "CN-GS";

export interface ChinaRegionDefinition {
  code: ChinaRegionCode;
  name: string;
  sourceIdentifiers: readonly string[];
  aliases: readonly string[];
}

export interface ChinaOutlineDocument {
  viewBox: [number, number, number, number];
  paths: string[];
}

export interface ChinaRegionShape {
  code: ChinaRegionCode;
  paths: string[];
  anchor: [number, number];
  label: [number, number];
  hitRadius: number;
}

export interface ChinaVisitedRegionsDocument {
  regions: ChinaRegionShape[];
}

export interface ChinaMapData {
  outline: ChinaOutlineDocument;
  visitedRegions: ChinaVisitedRegionsDocument;
}
