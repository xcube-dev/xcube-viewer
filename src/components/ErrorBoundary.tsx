import * as React from "react";
import { ErrorInfo } from "react";

export interface ErrorBoundaryProps {

}

export interface ErrorBoundaryState {
    error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.error) {
            // Render custom fallback UI
            return <h1>Something went wrong: ${this.state.error}</h1>;
        }

        return this.props.children;
    }
}