import type { KeyboardEvent } from "react";
import { chinaRegionByCode, chinaRegions } from "../../../data/chinaRegions";
import type {
  ChinaMapData,
  ChinaRegionCode,
} from "../../../types/chinaRegion";

interface ChinaRegionalMapProps {
  data: ChinaMapData;
  selectedRegionCode: ChinaRegionCode | null;
  hoveredRegionCode: ChinaRegionCode | null;
  onSelectRegion: (code: ChinaRegionCode) => void;
  onHoverRegion: (code: ChinaRegionCode | null) => void;
}

function isOffsetLabel(anchor: [number, number], label: [number, number]) {
  return Math.abs(anchor[0] - label[0]) > 1 || Math.abs(anchor[1] - label[1]) > 1;
}

export function ChinaRegionalMap({
  data,
  selectedRegionCode,
  hoveredRegionCode,
  onSelectRegion,
  onHoverRegion,
}: ChinaRegionalMapProps) {
  const shapeByCode = new Map(
    data.visitedRegions.regions.map((shape) => [shape.code, shape]),
  );

  const selectWithKeyboard = (
    event: KeyboardEvent<SVGGElement>,
    code: ChinaRegionCode,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelectRegion(code);
  };

  return (
    <svg
      className="china-region-map"
      viewBox={data.outline.viewBox.join(" ")}
      role="img"
      aria-label="China visited regions map"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="china-region-map__outline" fillRule="evenodd">
        {data.outline.paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </g>

      {chinaRegions.map((region) => {
        const shape = shapeByCode.get(region.code);
        if (!shape) return null;
        const selected = selectedRegionCode === region.code;
        const hovered = hoveredRegionCode === region.code;
        const definition = chinaRegionByCode.get(region.code);
        const labelOffset = isOffsetLabel(shape.anchor, shape.label);

        return (
          <g
            key={region.code}
            className="china-region-map__region"
            data-region-code={region.code}
            data-selected={selected ? "true" : "false"}
            data-hovered={hovered ? "true" : "false"}
            role="button"
            tabIndex={0}
            aria-label={definition?.name ?? region.name}
            aria-pressed={selected}
            onClick={() => onSelectRegion(region.code)}
            onKeyDown={(event) => selectWithKeyboard(event, region.code)}
            onMouseEnter={() => onHoverRegion(region.code)}
            onMouseLeave={() => onHoverRegion(null)}
            onFocus={() => onHoverRegion(region.code)}
            onBlur={() => onHoverRegion(null)}
          >
            <g className="china-region-map__shape" fillRule="evenodd">
              {shape.paths.map((path, index) => (
                <path key={index} d={path} />
              ))}
            </g>
            {shape.hitRadius > 0 ? (
              <circle
                className="china-region-map__hit-area"
                cx={shape.anchor[0]}
                cy={shape.anchor[1]}
                r={shape.hitRadius}
              />
            ) : null}
            {labelOffset ? (
              <line
                className="china-region-map__leader"
                x1={shape.anchor[0]}
                y1={shape.anchor[1]}
                x2={shape.label[0]}
                y2={shape.label[1]}
              />
            ) : null}
            <circle
              className="china-region-map__anchor"
              cx={shape.anchor[0]}
              cy={shape.anchor[1]}
              r={shape.hitRadius > 0 ? 3.5 : 2.5}
            />
            <text
              className="china-region-map__label"
              x={shape.label[0]}
              y={shape.label[1] - 7}
              textAnchor="middle"
            >
              {region.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
