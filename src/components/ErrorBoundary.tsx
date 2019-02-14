import * as React from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
}

interface ErrorBoundaryState {
    error: Error | null;
}

/**
 * An error boundary is used to catch JavaScript errors anywhere in their child component tree, log those errors,
 * and display a fallback UI (see https://reactjs.org/docs/error-boundaries.html).
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: object) {
        super(props);
        this.state = {error: null};
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return {error};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        //  log error information here, e.g. send info to API
    }

    render() {
        if (!this.props.children) {
            throw new Error('An ErrorBoundary requires at least one child');
        }

        if (this.state.error) {
            // Error path
            return (
                /*I18N*/
                <div>
                    <h2 className="errorBoundary-header">Something went wrong.</h2>
                    <details className="errorBoundary-details" style={{whiteSpace: 'pre-wrap'}}>
                        {this.state.error.toString()}
                        <br/>
                    </details>
                </div>
            );
        }

        // Normally, just render children
        return this.props.children;
    }
}
