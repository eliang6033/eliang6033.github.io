import type { KeyboardEvent } from "react";
import { siteContent } from "../../../config/siteContent";
import { usaStateByCode, usaStates } from "../../../data/usaStates";
import type { USAMapData, USAStateCode } from "../../../types/usaState";

interface USARegionalMapProps {
  data: USAMapData;
  selectedStateCode: USAStateCode | null;
  hoveredStateCode: USAStateCode | null;
  onSelectState: (code: USAStateCode) => void;
  onHoverState: (code: USAStateCode | null) => void;
}

function isOffsetLabel(anchor: [number, number], label: [number, number]) {
  return Math.abs(anchor[0] - label[0]) > 1 || Math.abs(anchor[1] - label[1]) > 1;
}

export function USARegionalMap({
  data,
  selectedStateCode,
  hoveredStateCode,
  onSelectState,
  onHoverState,
}: USARegionalMapProps) {
  const content = siteContent.usaRegionalMode;
  const shapeByCode = new Map(
    data.visitedStates.states.map((shape) => [shape.code, shape]),
  );
  const alaskaName = usaStateByCode.get("US-AK")?.name;
  const [insetX, insetY, insetWidth, insetHeight] =
    data.outline.alaskaInset.frame;

  const selectWithKeyboard = (
    event: KeyboardEvent<SVGGElement>,
    code: USAStateCode,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelectState(code);
  };

  return (
    <svg
      className="china-region-map usa-state-map"
      viewBox={data.outline.viewBox.join(" ")}
      role="img"
      aria-label={content.mapAriaLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        className="china-region-map__outline usa-state-map__outline"
        fillRule="evenodd"
      >
        {data.outline.contiguousPaths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </g>

      <g
        className="usa-state-map__inset"
        aria-label={
          alaskaName
            ? `${content.alaskaInsetLabel}: ${alaskaName}`
            : content.alaskaInsetLabel
        }
      >
        <rect
          className="usa-state-map__inset-frame"
          x={insetX}
          y={insetY}
          width={insetWidth}
          height={insetHeight}
          rx={13}
        />
        <text
          className="usa-state-map__inset-label"
          x={insetX + 15}
          y={insetY + 21}
        >
          {content.alaskaInsetLabel}
        </text>
      </g>

      {usaStates.map((state) => {
        const shape = shapeByCode.get(state.code);
        if (!shape) return null;
        const selected = selectedStateCode === state.code;
        const hovered = hoveredStateCode === state.code;
        const definition = usaStateByCode.get(state.code);
        const labelOffset = isOffsetLabel(shape.anchor, shape.label);

        return (
          <g
            key={state.code}
            className="china-region-map__region usa-state-map__state"
            data-state-code={state.code}
            data-zone={shape.zone}
            data-selected={selected ? "true" : "false"}
            data-hovered={hovered ? "true" : "false"}
            role="button"
            tabIndex={0}
            aria-label={definition?.name ?? state.name}
            aria-pressed={selected}
            onClick={() => onSelectState(state.code)}
            onKeyDown={(event) => selectWithKeyboard(event, state.code)}
            onMouseEnter={() => onHoverState(state.code)}
            onMouseLeave={() => onHoverState(null)}
            onFocus={() => onHoverState(state.code)}
            onBlur={() => onHoverState(null)}
          >
            <g
              className="china-region-map__shape usa-state-map__shape"
              fillRule="evenodd"
            >
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
              {state.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
