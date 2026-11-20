// Optional offline illustration generator; not part of the homepage bundle/build.
// Both orthographic views use Natural Earth via the existing world-atlas package.
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const assets = new URL("../src/assets/journey/", import.meta.url);
const { width, height, radius, hemispheres } = JSON.parse(await readFile(new URL("atlas-views.json", assets)));
const world = JSON.parse(await readFile(require.resolve("world-atlas/countries-110m.json")));
const land = feature(world, world.objects.land);
const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule().step([20, 20])();
const images = hemispheres.map(({ x, y, longitude, latitude }, i) => {
  const projection = geoOrthographic().rotate([-longitude, -latitude]).translate([x, y]).scale(radius);
  const path = geoPath(projection).digits(1);
  const ticks = Array.from({ length: 72 }, (_, index) => {
    const a = index * Math.PI / 36, outer = radius + (index % 6 ? 3 : 6);
    const point = r => [x + Math.sin(a) * r, y - Math.cos(a) * r].map(v => v.toFixed(1)).join(",");
    return `M${point(radius + 1)}L${point(outer)}`;
  }).join("");
  return `<g>
    <circle cx="${x}" cy="${y}" r="${radius}" fill="#263830" stroke="#b5bd9f" stroke-width="1"/>
    <defs><path id="land${i}" d="${path(land)}"/></defs>
    <use href="#land${i}" fill="#c8c8ab" stroke="#c8c8ab" stroke-width=".25"/>
    <use href="#land${i}" fill="url(#hatch)"/>
    <path d="${path(borders)}" fill="none" stroke="#536358" stroke-width=".45"/>
    <path d="${path(graticule)}" fill="none" stroke="#93a48c" stroke-opacity=".6" stroke-width=".55"/>
    <path d="${ticks}" fill="none" stroke="#9ba68e" stroke-width=".65"/>
  </g>`;
});
await writeFile(new URL("atlas-hemispheres.svg", assets),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><path d="M.5 0V4" fill="none" stroke="#798372" stroke-width=".6"/></pattern></defs>${images.join("")}</svg>\n`);
