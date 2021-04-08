import React from "react";
import {IErrorBoundaryProps, IErrorBoundaryState} from "./IErrorBoundary";

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState>
{
    constructor(props: IErrorBoundaryProps)
    {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error): IErrorBoundaryState
    {
        return {hasError: true};
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void
    {
        if (this.props.onErrorBoundaryHandler && this.props.type)
        {
            this.props.onErrorBoundaryHandler(this.props.type);
        }
    }

    render(): React.ReactNode
    {
        return this.state.hasError ? (
            this.props.fallback ? this.props.fallback : null
        ) : this.props.children;
    }
}
