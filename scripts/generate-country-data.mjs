import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(
  projectRoot,
  "node_modules/world-atlas/countries-110m.json",
);
const outputPath = resolve(projectRoot, "public/data/countries.geojson");

const visitedIsoByNumericCode = {
  "156": "CHN",
  "702": "SGP",
  "840": "USA",
};

const topology = JSON.parse(await readFile(sourcePath, "utf8"));
const countries = feature(topology, topology.objects.countries);

countries.features = countries.features.map((country) => {
  const numericIsoCode = String(country.id).padStart(3, "0");
  return {
    ...country,
    properties: {
      ...country.properties,
      numericIsoCode,
      isoA3: visitedIsoByNumericCode[numericIsoCode],
    },
  };
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(countries)}\n`, "utf8");
