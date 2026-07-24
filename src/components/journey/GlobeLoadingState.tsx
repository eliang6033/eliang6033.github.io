import { uiStatusText } from "../../config/siteContent";

interface GlobeLoadingStateProps {
  error?: boolean;
  onRetry?: () => void;
}

export function GlobeLoadingState({
  error = false,
  onRetry,
}: GlobeLoadingStateProps) {
  return (
    <div className="globe-loading" role="status" aria-live="polite">
      <span className="globe-loading__wireframe" aria-hidden="true">
        <i />
        <i />
      </span>
      <p>
        {error ? uiStatusText.countryDataError : uiStatusText.initializingGlobe}
      </p>
      {error && onRetry ? (
        <button className="globe-loading__retry" type="button" onClick={onRetry}>
          {uiStatusText.retryGlobe}
        </button>
      ) : null}
    </div>
  );
}
