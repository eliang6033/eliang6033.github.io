import {
  isUSAStateCode,
  usaStateCodes,
  usaStates,
} from "../../../data/usaStates";
import type {
  USAMapData,
  USAOutlineDocument,
  USAStateShape,
  USAVisitedStatesDocument,
} from "../../../types/usaState";

const outlineUrl = "/data/usa/usa-outline.json";
const visitedStatesUrl = "/data/usa/usa-visited-states.json";

let cachedUSAMapData: USAMapData | null = null;
let usaMapDataPromise: Promise<USAMapData> | null = null;

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

function isOutlineDocument(value: unknown): value is USAOutlineDocument {
  if (!isRecord(value) || !isRecord(value.alaskaInset)) return false;
  return (
    isNumberTuple(value.viewBox, 4) &&
    isStringArray(value.contiguousPaths) &&
    isNumberTuple(value.alaskaInset.frame, 4)
  );
}

function isStateShape(value: unknown): value is USAStateShape {
  if (!isRecord(value) || typeof value.code !== "string") return false;
  return (
    isUSAStateCode(value.code) &&
    (value.zone === "contiguous" || value.zone === "alaska") &&
    isStringArray(value.paths) &&
    isNumberTuple(value.anchor, 2) &&
    isNumberTuple(value.label, 2) &&
    typeof value.hitRadius === "number" &&
    Number.isFinite(value.hitRadius)
  );
}

function isVisitedStatesDocument(
  value: unknown,
): value is USAVisitedStatesDocument {
  if (!isRecord(value) || !Array.isArray(value.states)) return false;
  if (!value.states.every(isStateShape)) return false;
  const codes = new Set(value.states.map(({ code }) => code));
  return (
    value.states.length === usaStates.length &&
    usaStates.every(({ code }) => codes.has(code)) &&
    codes.size === usaStateCodes.size
  );
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<unknown>;
}

export function loadUSAMapData(): Promise<USAMapData> {
  if (cachedUSAMapData) return Promise.resolve(cachedUSAMapData);

  if (!usaMapDataPromise) {
    usaMapDataPromise = Promise.all([
      fetchJson(outlineUrl),
      fetchJson(visitedStatesUrl),
    ])
      .then(([outline, visitedStates]) => {
        if (!isOutlineDocument(outline)) {
          throw new Error("Invalid United States outline map data.");
        }
        if (!isVisitedStatesDocument(visitedStates)) {
          throw new Error("Invalid United States visited-state map data.");
        }
        cachedUSAMapData = { outline, visitedStates };
        return cachedUSAMapData;
      })
      .catch((error: unknown) => {
        usaMapDataPromise = null;
        throw error;
      });
  }

  return usaMapDataPromise;
}

export function preloadUSAMapData() {
  return loadUSAMapData().then(() => undefined);
}
