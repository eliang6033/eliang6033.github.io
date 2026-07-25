import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "public/data/china");

const sourceUrls = {
  admin0:
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
  admin1:
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson",
};

const requestedRegions = [
  {
    code: "CN-XJ",
    name: "Xinjiang",
    sourceCollection: "admin1",
    sourceCode: "CN-XJ",
    aliases: ["Xinjiang", "Xinjiang Uygur Autonomous Region"],
  },
  {
    code: "CN-HL",
    name: "Heilongjiang",
    sourceCollection: "admin1",
    sourceCode: "CN-HL",
    aliases: ["Heilongjiang", "Hei Long Jiang"],
  },
  {
    code: "CN-BJ",
    name: "Beijing",
    sourceCollection: "admin1",
    sourceCode: "CN-BJ",
    aliases: ["Beijing"],
    labelOffset: [-30, -25],
    hitRadius: 34,
  },
  {
    code: "CN-SH",
    name: "Shanghai",
    sourceCollection: "admin1",
    sourceCode: "CN-SH",
    aliases: ["Shanghai"],
    labelOffset: [50, 4],
    hitRadius: 34,
  },
  {
    code: "CN-CQ",
    name: "Chongqing",
    sourceCollection: "admin1",
    sourceCode: "CN-CQ",
    aliases: ["Chongqing"],
  },
  {
    code: "CN-GD",
    name: "Guangdong",
    sourceCollection: "admin1",
    sourceCode: "CN-GD",
    aliases: ["Guangdong"],
  },
  {
    code: "CN-HI",
    name: "Hainan",
    sourceCollection: "admin1",
    sourceCode: "CN-HI",
    aliases: ["Hainan"],
    labelOffset: [28, 30],
    hitRadius: 36,
  },
  {
    code: "CN-HK",
    name: "Hong Kong",
    sourceCollection: "admin0",
    sourceCode: "HKG",
    aliases: ["Hong Kong", "Hong Kong SAR", "Hong Kong S.A.R."],
    labelOffset: [70, 31],
    hitRadius: 38,
  },
  {
    code: "CN-FJ",
    name: "Fujian",
    sourceCollection: "admin1",
    sourceCode: "CN-FJ",
    aliases: ["Fujian"],
  },
  {
    code: "CN-GS",
    name: "Gansu",
    sourceCollection: "admin1",
    sourceCode: "CN-GS",
    aliases: ["Gansu"],
  },
];

const viewBox = { width: 1000, height: 680, padding: 34 };

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

function createProjection(outlineFeatures) {
  const bounds = {
    minLng: Number.POSITIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLng: Number.NEGATIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  };

  for (const feature of outlineFeatures) {
    forEachCoordinate(feature.geometry, ([longitude, latitude]) => {
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
    (viewBox.width - viewBox.padding * 2) / projectedWidth,
    (viewBox.height - viewBox.padding * 2) / projectedHeight,
  );
  const drawnWidth = projectedWidth * scale;
  const drawnHeight = projectedHeight * scale;
  const offsetX = (viewBox.width - drawnWidth) / 2;
  const offsetY = (viewBox.height - drawnHeight) / 2;

  return {
    bounds,
    project([longitude, latitude]) {
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
    properties.NAME_SORT,
  ]
    .flatMap((value) => String(value ?? "").split("|"))
    .map(normalizedName);
  return aliases.some((alias) => values.includes(normalizedName(alias)));
}

function findRegionFeature(definition, admin0Features, admin1Features) {
  const sourceFeatures =
    definition.sourceCollection === "admin0" ? admin0Features : admin1Features;
  const feature = sourceFeatures.find((candidate) => {
    const properties = candidate.properties ?? {};
    const sourceCode =
      definition.sourceCollection === "admin0"
        ? properties.ADM0_A3
        : properties.iso_3166_2;
    return (
      sourceCode === definition.sourceCode ||
      matchesAliases(candidate, definition.aliases)
    );
  });
  if (!feature) throw new Error(`Missing source feature for ${definition.name}`);
  return feature;
}

function sourceLabelCoordinate(feature, definition) {
  const properties = feature.properties ?? {};
  if (definition.sourceCollection === "admin0") {
    return [properties.LABEL_X, properties.LABEL_Y];
  }
  return [properties.longitude, properties.latitude];
}

const argumentsByName = parseArguments();
const [admin0, admin1] = await Promise.all([
  loadJson(argumentsByName.admin0, sourceUrls.admin0),
  loadJson(argumentsByName.admin1, sourceUrls.admin1),
]);

const chinaOutline = admin0.features.find(
  (feature) => feature.properties?.ADM0_A3 === "CHN",
);
const hongKongOutline = admin0.features.find(
  (feature) => feature.properties?.ADM0_A3 === "HKG",
);
if (!chinaOutline || !hongKongOutline) {
  throw new Error("Natural Earth China or Hong Kong country geometry is missing.");
}

const chinaAdmin1 = admin1.features.filter(
  (feature) =>
    feature.properties?.adm0_a3 === "CHN" &&
    feature.properties?.geonunit === "China",
);
const { bounds, project } = createProjection([chinaOutline, hongKongOutline]);

const outlineDocument = {
  viewBox: [0, 0, viewBox.width, viewBox.height],
  paths: [chinaOutline, hongKongOutline].flatMap((feature) =>
    geometryToPaths(feature.geometry, project, 0.72, 0.18),
  ),
};

const visitedRegionsDocument = {
  regions: requestedRegions.map((definition) => {
    const feature = findRegionFeature(
      definition,
      admin0.features,
      chinaAdmin1,
    );
    const anchor = project(sourceLabelCoordinate(feature, definition));
    const labelOffset = definition.labelOffset ?? [0, 0];
    return {
      code: definition.code,
      paths: geometryToPaths(feature.geometry, project, 0.52, 0.025),
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
    resolve(outputDirectory, "china-outline.json"),
    `${JSON.stringify(outlineDocument)}\n`,
    "utf8",
  ),
  writeFile(
    resolve(outputDirectory, "china-visited-regions.json"),
    `${JSON.stringify(visitedRegionsDocument)}\n`,
    "utf8",
  ),
]);

console.log(
  JSON.stringify(
    {
      bounds,
      outlinePathCount: outlineDocument.paths.length,
      regionCount: visitedRegionsDocument.regions.length,
      sourceUrls,
    },
    null,
    2,
  ),
);
