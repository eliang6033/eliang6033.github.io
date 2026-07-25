import type {
  ChinaRegionCode,
  ChinaRegionDefinition,
} from "../types/chinaRegion";

export const chinaRegions = [
  {
    code: "CN-XJ",
    name: "Xinjiang",
    sourceIdentifiers: ["CN-XJ", "CN.XJ", "CN-65"],
    aliases: ["Xinjiang", "Xinjiang Uygur Autonomous Region"],
  },
  {
    code: "CN-HL",
    name: "Heilongjiang",
    sourceIdentifiers: ["CN-HL", "CN.HL", "CN-23"],
    aliases: ["Heilongjiang", "Hei Long Jiang"],
  },
  {
    code: "CN-BJ",
    name: "Beijing",
    sourceIdentifiers: ["CN-BJ", "CN.BJ", "CN-11"],
    aliases: ["Beijing"],
  },
  {
    code: "CN-SH",
    name: "Shanghai",
    sourceIdentifiers: ["CN-SH", "CN.SH", "CN-31"],
    aliases: ["Shanghai"],
  },
  {
    code: "CN-CQ",
    name: "Chongqing",
    sourceIdentifiers: ["CN-CQ", "CN.CQ", "CN-50"],
    aliases: ["Chongqing"],
  },
  {
    code: "CN-GD",
    name: "Guangdong",
    sourceIdentifiers: ["CN-GD", "CN.GD", "CN-44"],
    aliases: ["Guangdong"],
  },
  {
    code: "CN-HI",
    name: "Hainan",
    sourceIdentifiers: ["CN-HI", "CN.HA", "CN-46"],
    aliases: ["Hainan"],
  },
  {
    code: "CN-HK",
    name: "Hong Kong",
    sourceIdentifiers: ["CN-HK", "HKG", "CN.HK"],
    aliases: ["Hong Kong", "Hong Kong SAR", "Hong Kong S.A.R."],
  },
  {
    code: "CN-FJ",
    name: "Fujian",
    sourceIdentifiers: ["CN-FJ", "CN.FJ", "CN-35"],
    aliases: ["Fujian"],
  },
  {
    code: "CN-GS",
    name: "Gansu",
    sourceIdentifiers: ["CN-GS", "CN.GS", "CN-62"],
    aliases: ["Gansu"],
  },
] as const satisfies readonly ChinaRegionDefinition[];

export const chinaRegionCodes = new Set<ChinaRegionCode>(
  chinaRegions.map(({ code }) => code),
);

export const chinaRegionByCode = new Map<
  ChinaRegionCode,
  ChinaRegionDefinition
>(chinaRegions.map((region) => [region.code, region]));

export function isChinaRegionCode(value: string): value is ChinaRegionCode {
  return chinaRegionCodes.has(value as ChinaRegionCode);
}
