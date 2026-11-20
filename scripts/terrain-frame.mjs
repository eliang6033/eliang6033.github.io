import { readFileSync } from "node:fs";

// West, south, east, north of the local Blue Marble crops, in degrees.
const extents = JSON.parse(readFileSync(new URL("./terrain-extents.json", import.meta.url), "utf8"));

export function terrainFrame(region, project) {
  const [west, south, east, north] = extents[region];
  const [x, y] = project([west, north]);
  const [right, bottom] = project([east, south]);
  return [x, y, right - x, bottom - y].map(n => Number(n.toFixed(3)));
}
