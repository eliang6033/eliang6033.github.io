import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "public/data/usa");

const sourceUrls = {
  admin0:
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
  admin1:
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson",
};

const requestedStates = [
  {
    code: "US-CA",
    name: "California",
    sourceIdentifiers: ["US-CA", "CA", "US06", "USA-3521"],
    aliases: ["California"],
    labelOffset: [-12, 2],
  },
  {
    code: "US-WY",
    name: "Wyoming",
    sourceIdentifiers: ["US-WY", "WY", "US56", "USA-3527"],
    aliases: ["Wyoming"],
  },
  {
    code: "US-AZ",
    name: "Arizona",
    sourceIdentifiers: ["US-AZ", "AZ", "US04", "USA-3520"],
    aliases: ["Arizona"],
    labelOffset: [8, 10],
  },
  {
    code: "US-NV",
    name: "Nevada",
    sourceIdentifiers: ["US-NV", "NV", "US32", "USA-3523"],
    aliases: ["Nevada"],
    labelOffset: [3, -7],
  },
  {
    code: "US-WA",
    name: "Washington",
    sourceIdentifiers: ["US-WA", "WA", "US53", "USA-3519"],
    aliases: ["Washington", "Washington State"],
    labelOffset: [18, 12],
  },
  {
    code: "US-NY",
    name: "New York",
    sourceIdentifiers: ["US-NY", "NY", "US36", "USA-3559"],
    aliases: ["New York", "New York State"],
    labelOffset: [34, 4],
    hitRadius: 22,
  },
  {
    code: "US-AK",
    name: "Alaska",
    sourceIdentifiers: ["US-AK", "AK", "US02", "USA-3563"],
    aliases: ["Alaska"],
    zone: "alaska",
    labelOffset: [12, 4],
  },
  {
    code: "US-TX",
    name: "Texas",
    sourceIdentifiers: ["US-TX", "TX", "US48", "USA-3536"],
    aliases: ["Texas"],
  },
];

const viewBox = [0, 0, 1000, 680];
const contiguousBox = { x: 34, y: 28, width: 932, height: 468, padding: 12 };
const alaskaInsetFrame = [46, 510, 310, 142];
const alaskaBox = { x: 62, y: 538, width: 278, height: 98, padding: 5 };

function parseArguments() {
  const args = process.argv.slice(2);
  const result = { admin0: null, admin1: null };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--admin0") result.admin0 = args[index + 1] ?? null;
    if (args[index] === "--admin1") result.admin1 = args[index + 1] ?? null;
  }
  return result;
}

async function loadJson(localPath, remoteUrl) {
  if (localPath) return JSON.parse(await readFile(resolve(localPath), "utf8"));
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error(`Unable to download ${remoteUrl}: ${response.status}`);
  }
  return response.json();
}

function normalizedName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[.']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function geometryCoordinates(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  throw new Error(`Unsupported geometry type: ${geometry.type}`);
}

function forEachCoordinate(geometry, callback) {
  for (const polygon of geometryCoordinates(geometry)) {
    for (const ring of polygon) {
      for (const coordinate of ring) callback(coordinate);
    }
  }
}

function polygonBounds(polygon) {
  const bounds = {
    minLng: Number.POSITIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLng: Number.NEGATIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  };
  for (const ring of polygon) {
    for (const [longitude, latitude] of ring) {
      bounds.minLng = Math.min(bounds.minLng, longitude);
      bounds.maxLng = Math.max(bounds.maxLng, longitude);
      bounds.minLat = Math.min(bounds.minLat, latitude);
      bounds.maxLat = Math.max(bounds.maxLat, latitude);
    }
  }
  return bounds;
}

function contiguousGeometry(geometry) {
  const polygons = geometryCoordinates(geometry).filter((polygon) => {
    const bounds = polygonBounds(polygon);
    const centerLongitude = (bounds.minLng + bounds.maxLng) / 2;
    const centerLatitude = (bounds.minLat + bounds.maxLat) / 2;
    return (
      centerLongitude >= -130 &&
      centerLongitude <= -60 &&
      centerLatitude >= 23 &&
      centerLatitude <= 50.5
    );
  });
  if (polygons.length === 0) {
    throw new Error("Natural Earth contiguous USA geometry is missing.");
  }
  return { type: "MultiPolygon", coordinates: polygons };
}

function normalizeAlaskaCoordinate([longitude, latitude]) {
  return [longitude > 0 ? longitude - 360 : longitude, latitude];
}

function createProjection(geometries, box, transform = (coordinate) => coordinate) {
  const bounds = {
    minLng: Number.POSITIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLng: Number.NEGATIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  };

  for (const geometry of geometries) {
    forEachCoordinate(geometry, (coordinate) => {
      const [longitude, latitude] = transform(coordinate);
      bounds.minLng = Math.min(bounds.minLng, longitude);
      bounds.maxLng = Math.max(bounds.maxLng, longitude);
      bounds.minLat = Math.min(bounds.minLat, latitude);
      bounds.maxLat = Math.max(bounds.maxLat, latitude);
    });
  }

  const centerLatitude = (bounds.minLat + bounds.maxLat) / 2;
  const longitudeScale = Math.cos((centerLatitude * Math.PI) / 180);
  const projectedWidth = (bounds.maxLng - bounds.minLng) * longitudeScale;
  const projectedHeight = bounds.maxLat - bounds.minLat;
  const scale = Math.min(
    (box.width - box.padding * 2) / projectedWidth,
    (box.height - box.padding * 2) / projectedHeight,
  );
  const drawnWidth = projectedWidth * scale;
  const drawnHeight = projectedHeight * scale;
  const offsetX = box.x + (box.width - drawnWidth) / 2;
  const offsetY = box.y + (box.height - drawnHeight) / 2;

  return {
    bounds,
    project(coordinate) {
      const [longitude, latitude] = transform(coordinate);
      return [
        offsetX + (longitude - bounds.minLng) * longitudeScale * scale,
        offsetY + (bounds.maxLat - latitude) * scale,
      ];
    },
  };
}

function pointSegmentDistanceSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) {
    return (point[0] - start[0]) ** 2 + (point[1] - start[1]) ** 2;
  }
  const amount = Math.max(
    0,
    Math.min(
      1,
      ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) /
        (dx * dx + dy * dy),
    ),
  );
  const closestX = start[0] + amount * dx;
  const closestY = start[1] + amount * dy;
  return (point[0] - closestX) ** 2 + (point[1] - closestY) ** 2;
}

function simplifyLine(points, tolerance) {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const toleranceSquared = tolerance * tolerance;

  while (stack.length) {
    const [startIndex, endIndex] = stack.pop();
    let furthestIndex = -1;
    let furthestDistance = toleranceSquared;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = pointSegmentDistanceSquared(
        points[index],
        points[startIndex],
        points[endIndex],
      );
      if (distance > furthestDistance) {
        furthestDistance = distance;
        furthestIndex = index;
      }
    }
    if (furthestIndex !== -1) {
      keep[furthestIndex] = 1;
      stack.push([startIndex, furthestIndex], [furthestIndex, endIndex]);
    }
  }
  return points.filter((_, index) => keep[index] === 1);
}

function simplifyRing(points, tolerance) {
  const openRing = points.slice(0, -1);
  if (openRing.length <= 5) return openRing;
  const splitIndex = Math.floor(openRing.length / 2);
  const firstArc = simplifyLine(openRing.slice(0, splitIndex + 1), tolerance);
  const secondArc = simplifyLine(
    [...openRing.slice(splitIndex), openRing[0]],
    tolerance,
  );
  return [...firstArc.slice(0, -1), ...secondArc.slice(0, -1)];
}

function ringArea(points) {
  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const next = points[(index + 1) % points.length];
    sum += points[index][0] * next[1] - next[0] * points[index][1];
  }
  return Math.abs(sum / 2);
}

function coordinateText(value) {
  return String(Math.round(value * 10) / 10);
}

function geometryToPaths(geometry, project, tolerance, minimumArea) {
  const paths = [];
  for (const polygon of geometryCoordinates(geometry)) {
    const rings = [];
    for (const ring of polygon) {
      const projected = ring.map(project);
      const simplified = simplifyRing(projected, tolerance);
      if (simplified.length < 3 || ringArea(simplified) < minimumArea) continue;
      rings.push(
        `M${simplified
          .map(([x, y]) => `${coordinateText(x)} ${coordinateText(y)}`)
          .join("L")}Z`,
      );
    }
    if (rings.length) paths.push(rings.join(""));
  }
  return paths;
}

function matchesAliases(feature, aliases) {
  const properties = feature.properties ?? {};
  const values = [
    properties.name,
    properties.name_alt,
    properties.NAME,
    properties.NAME_ALT,
    properties.NAME_LONG,
  ]
    .flatMap((value) => String(value ?? "").split("|"))
    .map(normalizedName);
  return aliases.some((alias) => values.includes(normalizedName(alias)));
}

function findStateFeature(definition, features) {
  const feature = features.find((candidate) => {
    const properties = candidate.properties ?? {};
    const identifiers = [
      properties.iso_3166_2,
      properties.postal,
      properties.fips,
      properties.adm1_code,
    ].map((value) => String(value ?? ""));
    return (
      identifiers.some((identifier) =>
        definition.sourceIdentifiers.includes(identifier),
      ) || matchesAliases(candidate, definition.aliases)
    );
  });
  if (!feature) throw new Error(`Missing source feature for ${definition.name}`);
  return feature;
}

const argumentsByName = parseArguments();
const [admin0, admin1] = await Promise.all([
  loadJson(argumentsByName.admin0, sourceUrls.admin0),
  loadJson(argumentsByName.admin1, sourceUrls.admin1),
]);

const usaOutline = admin0.features.find(
  (feature) => feature.properties?.ADM0_A3 === "USA",
);
if (!usaOutline) throw new Error("Natural Earth USA country geometry is missing.");

const usaAdmin1 = admin1.features.filter(
  (feature) => feature.properties?.adm0_a3 === "USA",
);
const sourceFeatures = new Map(
  requestedStates.map((definition) => [
    definition.code,
    findStateFeature(definition, usaAdmin1),
  ]),
);
const alaskaFeature = sourceFeatures.get("US-AK");
if (!alaskaFeature) throw new Error("Natural Earth Alaska geometry is missing.");

const contiguousOutlineGeometry = contiguousGeometry(usaOutline.geometry);
const contiguousProjection = createProjection(
  [contiguousOutlineGeometry],
  contiguousBox,
);
const alaskaProjection = createProjection(
  [alaskaFeature.geometry],
  alaskaBox,
  normalizeAlaskaCoordinate,
);

const outlineDocument = {
  viewBox,
  contiguousPaths: geometryToPaths(
    contiguousOutlineGeometry,
    contiguousProjection.project,
    0.68,
    0.16,
  ),
  alaskaInset: { frame: alaskaInsetFrame },
};

const visitedStatesDocument = {
  states: requestedStates.map((definition) => {
    const feature = sourceFeatures.get(definition.code);
    if (!feature) throw new Error(`Missing cached feature for ${definition.name}`);
    const projection =
      definition.zone === "alaska" ? alaskaProjection : contiguousProjection;
    const properties = feature.properties ?? {};
    const anchor = projection.project([
      properties.longitude,
      properties.latitude,
    ]);
    const labelOffset = definition.labelOffset ?? [0, 0];
    return {
      code: definition.code,
      zone: definition.zone ?? "contiguous",
      paths: geometryToPaths(
        feature.geometry,
        projection.project,
        definition.zone === "alaska" ? 0.42 : 0.36,
        definition.zone === "alaska" ? 0.035 : 0.018,
      ),
      anchor: anchor.map((value) => Math.round(value * 10) / 10),
      label: [
        Math.round((anchor[0] + labelOffset[0]) * 10) / 10,
        Math.round((anchor[1] + labelOffset[1]) * 10) / 10,
      ],
      hitRadius: definition.hitRadius ?? 0,
    };
  }),
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    resolve(outputDirectory, "usa-outline.json"),
    `${JSON.stringify(outlineDocument)}\n`,
    "utf8",
  ),
  writeFile(
    resolve(outputDirectory, "usa-visited-states.json"),
    `${JSON.stringify(visitedStatesDocument)}\n`,
    "utf8",
  ),
]);

console.log(
  JSON.stringify(
    {
      contiguousBounds: contiguousProjection.bounds,
      alaskaBounds: alaskaProjection.bounds,
      outlinePathCount: outlineDocument.contiguousPaths.length,
      stateCount: visitedStatesDocument.states.length,
      sourceUrls,
    },
    null,
    2,
  ),
);
