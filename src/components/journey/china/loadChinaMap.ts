import {
  chinaRegionCodes,
  chinaRegions,
  isChinaRegionCode,
} from "../../../data/chinaRegions";
import type {
  ChinaMapData,
  ChinaOutlineDocument,
  ChinaRegionShape,
  ChinaVisitedRegionsDocument,
} from "../../../types/chinaRegion";

const outlineUrl = "/data/china/china-outline.json";
const visitedRegionsUrl = "/data/china/china-visited-regions.json";

let cachedChinaMapData: ChinaMapData | null = null;
let chinaMapDataPromise: Promise<ChinaMapData> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumberTuple(value: unknown, length: number): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === length &&
    value.every((item) => typeof item === "number" && Number.isFinite(item))
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOutlineDocument(value: unknown): value is ChinaOutlineDocument {
  if (!isRecord(value)) return false;
  return isNumberTuple(value.viewBox, 4) && isStringArray(value.paths);
}

function isRegionShape(value: unknown): value is ChinaRegionShape {
  if (!isRecord(value) || typeof value.code !== "string") return false;
  return (
    isChinaRegionCode(value.code) &&
    isStringArray(value.paths) &&
    isNumberTuple(value.anchor, 2) &&
    isNumberTuple(value.label, 2) &&
    typeof value.hitRadius === "number" &&
    Number.isFinite(value.hitRadius)
  );
}

function isVisitedRegionsDocument(
  value: unknown,
): value is ChinaVisitedRegionsDocument {
  if (!isRecord(value) || !Array.isArray(value.regions)) return false;
  if (!value.regions.every(isRegionShape)) return false;
  const codes = new Set(value.regions.map(({ code }) => code));
  return (
    value.regions.length === chinaRegions.length &&
    chinaRegions.every(({ code }) => codes.has(code)) &&
    codes.size === chinaRegionCodes.size
  );
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<unknown>;
}

export function loadChinaMapData(): Promise<ChinaMapData> {
  if (cachedChinaMapData) return Promise.resolve(cachedChinaMapData);

  if (!chinaMapDataPromise) {
    chinaMapDataPromise = Promise.all([
      fetchJson(outlineUrl),
      fetchJson(visitedRegionsUrl),
    ])
      .then(([outline, visitedRegions]) => {
        if (!isOutlineDocument(outline)) {
          throw new Error("Invalid China outline map data.");
        }
        if (!isVisitedRegionsDocument(visitedRegions)) {
          throw new Error("Invalid China visited-region map data.");
        }
        cachedChinaMapData = { outline, visitedRegions };
        return cachedChinaMapData;
      })
      .catch((error: unknown) => {
        chinaMapDataPromise = null;
        throw error;
      });
  }

  return chinaMapDataPromise;
}

export function preloadChinaMapData() {
  return loadChinaMapData().then(() => undefined);
}
