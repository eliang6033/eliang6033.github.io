import { ArrowLeft } from "lucide-react";
import { siteContent, uiStatusText } from "../../config/siteContent";
import { GlobeLoadingState } from "./GlobeLoadingState";
import { StarBackground } from "./StarBackground";

interface JourneyLoadingShellProps {
  onClose: () => void;
  error?: boolean;
  onRetry?: () => void;
}

export function JourneyLoadingShell({
  onClose,
  error = false,
  onRetry,
}: JourneyLoadingShellProps) {
  const content = siteContent.journeyMode;

  return (
    <div
      className="journey-mode journey-mode--loading"
      role="dialog"
      aria-modal="true"
      aria-label={content.ariaLabel}
    >
      <StarBackground />
      <div className="journey-mode__topbar">
        <button
          className="journey-back"
          type="button"
          onClick={onClose}
          aria-label={content.backButtonAria}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span>{content.backButton}</span>
        </button>
        <p>{content.instructions}</p>
      </div>

      <div className="journey-loading-frame">
        {error ? (
          <div className="globe-loading" role="alert">
            <span className="globe-loading__wireframe" aria-hidden="true">
              <i />
              <i />
            </span>
            <p>{uiStatusText.journeyLoadError}</p>
            {onRetry ? (
              <button
                className="globe-loading__retry"
                type="button"
                onClick={onRetry}
              >
                {uiStatusText.retryGlobe}
              </button>
            ) : null}
          </div>
        ) : (
          <GlobeLoadingState />
        )}
      </div>
    </div>
  );
}
