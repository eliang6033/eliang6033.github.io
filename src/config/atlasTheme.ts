// Shared inks for the printed hemispheres, interactive globe and regional maps.
// The DOM uses --atlas-*; Three.js receives the same colors directly.
export const atlasInks = {
  plate: "#23342D",
  deep: "#192823",
  surface: "#2B4036",
  paper: "#EFEBDD",
  muted: "#B9C3B1",
  rule: "#687C6E",
  chapter: "#BC9C63",
  "chapter-edge": "#E5CCA0",
  visited: "#72988D",
  "visited-edge": "#ABCCC0",
} as const;

// Keep the natural satellite relief visible through the cartographic inks.
export const atlasGlobe = {
  daylight: "#F4F1E1",
  emissive: "#10251E",
  specular: "#17241D",
  atmosphere: "#96B3A4",
  unvisited: "#354A3F",
  landWash: atlasInks.plate + "0a",
  hoverWash: atlasInks.muted + "24",
  boundary: atlasInks.muted + "55",
  side: atlasInks.deep + "32",
} as const;
