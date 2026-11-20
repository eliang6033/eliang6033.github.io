import { useId } from "react";

interface RegionalTerrainProps {
  src: string;
  paths: string[];
  frame?: [number, number, number, number];
}

/** Decorative only: the overlying province/state paths retain all interaction. */
export function RegionalTerrain({ src, paths, frame }: RegionalTerrainProps) {
  const clipId = useId();
  if (!frame) return null; // A previously cached outline may have no raster frame.
  const [x, y, width, height] = frame;

  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          {paths.map((path, index) => <path key={index} d={path} clipRule="evenodd" />)}
        </clipPath>
      </defs>
      <image
        href={src}
        x={x}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="none"
        clipPath={`url(#${clipId})`}
        opacity={0.76}
      />
    </g>
  );
}
