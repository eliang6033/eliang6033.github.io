import { usaStates } from "../../../data/usaStates";
import type { USAStateCode } from "../../../types/usaState";

interface USAPlacesListProps {
  selectedStateCode: USAStateCode | null;
  hoveredStateCode: USAStateCode | null;
  onSelectState: (code: USAStateCode) => void;
  onHoverState: (code: USAStateCode | null) => void;
}

export function USAPlacesList({
  selectedStateCode,
  hoveredStateCode,
  onSelectState,
  onHoverState,
}: USAPlacesListProps) {
  return (
    <div className="china-places-list usa-places-list">
      {usaStates.map((state) => {
        const selected = selectedStateCode === state.code;
        const hovered = hoveredStateCode === state.code;
        return (
          <button
            key={state.code}
            type="button"
            className={hovered ? "china-places-list__item--hovered" : undefined}
            aria-pressed={selected}
            onClick={() => onSelectState(state.code)}
            onMouseEnter={() => onHoverState(state.code)}
            onMouseLeave={() => onHoverState(null)}
            onFocus={() => onHoverState(state.code)}
            onBlur={() => onHoverState(null)}
          >
            <span className="china-places-list__indicator" aria-hidden="true" />
            <span className="usa-place-copy">
              <strong>{state.name}</strong>
              {state.note ? <small>{state.note}</small> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
