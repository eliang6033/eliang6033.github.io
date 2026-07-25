import type { USAStateCode, USAStatePlace } from "../types/usaState";

export const usaStates: readonly USAStatePlace[] = [
  {
    code: "US-CA",
    name: "California",
    sourceIdentifiers: ["US-CA", "CA", "US06", "USA-3521"],
    aliases: ["California"],
  },
  {
    code: "US-WY",
    name: "Wyoming",
    note: "Yellowstone National Park",
    sourceIdentifiers: ["US-WY", "WY", "US56", "USA-3527"],
    aliases: ["Wyoming"],
  },
  {
    code: "US-AZ",
    name: "Arizona",
    note: "Antelope Canyon",
    sourceIdentifiers: ["US-AZ", "AZ", "US04", "USA-3520"],
    aliases: ["Arizona"],
  },
  {
    code: "US-NV",
    name: "Nevada",
    note: "Death Valley National Park",
    sourceIdentifiers: ["US-NV", "NV", "US32", "USA-3523"],
    aliases: ["Nevada"],
  },
  {
    code: "US-WA",
    name: "Washington",
    sourceIdentifiers: ["US-WA", "WA", "US53", "USA-3519"],
    aliases: ["Washington", "Washington State"],
  },
  {
    code: "US-NY",
    name: "New York",
    sourceIdentifiers: ["US-NY", "NY", "US36", "USA-3559"],
    aliases: ["New York", "New York State"],
  },
  {
    code: "US-AK",
    name: "Alaska",
    sourceIdentifiers: ["US-AK", "AK", "US02", "USA-3563"],
    aliases: ["Alaska"],
  },
  {
    code: "US-TX",
    name: "Texas",
    note: "League of Legends Worlds 2026",
    sourceIdentifiers: ["US-TX", "TX", "US48", "USA-3536"],
    aliases: ["Texas"],
  },
];

export const usaStateCodes = new Set<USAStateCode>(
  usaStates.map(({ code }) => code),
);

export const usaStateByCode = new Map<USAStateCode, USAStatePlace>(
  usaStates.map((state) => [state.code, state]),
);

export function isUSAStateCode(value: string): value is USAStateCode {
  return usaStateCodes.has(value as USAStateCode);
}
