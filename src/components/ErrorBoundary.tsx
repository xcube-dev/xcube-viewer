/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from "react";
import i18n from "../i18n";
import { WithLocale } from "../util/lang";

import "./ErrorBoundary.css";

interface ErrorBoundaryProps extends WithLocale {}

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
