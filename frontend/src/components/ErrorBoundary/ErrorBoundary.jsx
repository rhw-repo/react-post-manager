import React from "react";
import debug from "debug";

class ErrorBoundary extends React.Component {
  static logger = debug("ErrorBoundary:error");

  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    ErrorBoundary.logger(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          An error has occured. Try refreshing the page or contact support if
          this problem persists.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
