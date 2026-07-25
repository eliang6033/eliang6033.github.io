import { chinaRegions } from "../../../data/chinaRegions";
import type { ChinaRegionCode } from "../../../types/chinaRegion";

interface ChinaPlacesListProps {
  selectedRegionCode: ChinaRegionCode | null;
  hoveredRegionCode: ChinaRegionCode | null;
  onSelectRegion: (code: ChinaRegionCode) => void;
  onHoverRegion: (code: ChinaRegionCode | null) => void;
}

export function ChinaPlacesList({
  selectedRegionCode,
  hoveredRegionCode,
  onSelectRegion,
  onHoverRegion,
}: ChinaPlacesListProps) {
  return (
    <div className="china-places-list">
      {chinaRegions.map((region) => {
        const selected = selectedRegionCode === region.code;
        const hovered = hoveredRegionCode === region.code;
        return (
          <button
            key={region.code}
            type="button"
            className={hovered ? "china-places-list__item--hovered" : undefined}
            aria-pressed={selected}
            onClick={() => onSelectRegion(region.code)}
            onMouseEnter={() => onHoverRegion(region.code)}
            onMouseLeave={() => onHoverRegion(null)}
            onFocus={() => onHoverRegion(region.code)}
            onBlur={() => onHoverRegion(null)}
          >
            <span className="china-places-list__indicator" aria-hidden="true" />
            <span>{region.name}</span>
          </button>
        );
      })}
    </div>
  );
}
