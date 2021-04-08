import {ReactNode} from "react";

export interface IErrorBoundaryProps
{
    fallback?: ReactNode;
    onErrorBoundaryHandler?: (type: string) => void;
    type?: string;
}

export interface IErrorBoundaryState
{
    hasError: boolean;
}
