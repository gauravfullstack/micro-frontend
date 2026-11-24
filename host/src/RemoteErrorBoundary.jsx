import { Component } from "react";

// Each remote gets its own boundary so one unavailable app does not hide the other.
export default class RemoteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep the failure visible in the developer console while showing a useful page fallback.
    console.error(`Could not load the ${this.props.name} remote.`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-error" role="alert">
          <strong>{this.props.name} is unavailable.</strong>
          <span>Start that app and reload this page.</span>
        </div>
      );
    }

    return this.props.children;
  }
}
