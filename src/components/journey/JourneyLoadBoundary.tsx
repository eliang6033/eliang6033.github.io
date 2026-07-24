import { Component, type ReactNode } from "react";
import { JourneyLoadingShell } from "./JourneyLoadingShell";

interface JourneyLoadBoundaryProps {
  children: ReactNode;
  onClose: () => void;
  onRetry: () => void;
}

interface JourneyLoadBoundaryState {
  failed: boolean;
}

export class JourneyLoadBoundary extends Component<
  JourneyLoadBoundaryProps,
  JourneyLoadBoundaryState
> {
  state: JourneyLoadBoundaryState = { failed: false };

  static getDerivedStateFromError(): JourneyLoadBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    // The visible recovery state is intentionally handled by render().
  }

  private retry = () => {
    this.setState({ failed: false }, this.props.onRetry);
  };

  render() {
    if (this.state.failed) {
      return (
        <JourneyLoadingShell
          error
          onClose={this.props.onClose}
          onRetry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}
