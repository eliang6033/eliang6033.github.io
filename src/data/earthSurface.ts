import earthSurfaceUrl from "../assets/journey/earth-day.webp";

// Cache decoded pixels between visits. GPU textures belong to each mounted globe.
let decodedSurface: Promise<HTMLImageElement> | undefined;

export function loadEarthSurface() {
  if (!decodedSurface) {
    const image = new Image();
    image.decoding = "async";
    image.src = earthSurfaceUrl;
    decodedSurface = image.decode().then(() => image).catch((error: unknown) => {
      decodedSurface = undefined;
      throw error;
    });
  }
  return decodedSurface;
}
