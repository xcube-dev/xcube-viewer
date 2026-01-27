/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";

import "./ErrorBoundary.css";

interface ErrorBoundaryProps extends WithLocale {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * An error boundary is used to catch JavaScript errors anywhere in their child component tree, log those errors,
 * and display a fallback UI (see https://reactjs.org/docs/error-boundaries.html).
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: object) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // log error information here, e.g. send info to API
    console.error(error);
    if (errorInfo.componentStack) {
      console.error(errorInfo.componentStack);
    }
  }

  render() {
    if (!this.props.children) {
      throw new Error("An ErrorBoundary requires at least one child");
    }

    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div>
        <h2 className="errorBoundary-header">
          {i18n.get("Something went wrong.")}
        </h2>
        <details
          className="errorBoundary-details"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {this.state.error.toString()}
          <br />
        </details>
      </div>
    );
  }
}
