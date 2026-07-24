import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lowResolutionSourcePath = resolve(
  projectRoot,
  "node_modules/world-atlas/countries-110m.json",
);
const detailedSourcePath = resolve(
  projectRoot,
  "node_modules/world-atlas/countries-50m.json",
);
const outputPath = resolve(projectRoot, "public/data/countries.geojson");

const visitedIsoByNumericCode = {
  "040": "AUT",
  "124": "CAN",
  "156": "CHN",
  "208": "DNK",
  "250": "FRA",
  "276": "DEU",
  "392": "JPN",
  "484": "MEX",
  "528": "NLD",
  "616": "POL",
  "702": "SGP",
  "756": "CHE",
  "840": "USA",
};

const lowResolutionTopology = JSON.parse(
  await readFile(lowResolutionSourcePath, "utf8"),
);
const detailedTopology = JSON.parse(await readFile(detailedSourcePath, "utf8"));
const countries = feature(
  lowResolutionTopology,
  lowResolutionTopology.objects.countries,
);
const detailedCountries = feature(
  detailedTopology,
  detailedTopology.objects.countries,
);

const singapore = detailedCountries.features.find(
  (country) => String(country.id).padStart(3, "0") === "702",
);

if (!singapore) {
  throw new Error("Singapore is missing from the detailed country dataset.");
}

countries.features.push(singapore);

countries.features = countries.features.map((country) => {
  const numericIsoCode = String(country.id).padStart(3, "0");
  const isoA3 = visitedIsoByNumericCode[numericIsoCode];
  return {
    type: country.type,
    id: country.id,
    properties: {
      name: country.properties?.name,
      ...(isoA3 ? { isoA3 } : {}),
    },
    geometry: country.geometry,
  };
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(countries)}\n`, "utf8");
