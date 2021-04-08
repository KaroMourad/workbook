import React, {FC} from "react";
import {IErrorFallbackProps} from "./IErrorFallback";

const ErrorFallback: FC<IErrorFallbackProps> = (): JSX.Element =>
{
    return (
        <div role="alert">
            <p>Something went wrong!</p>
        </div>
    );
};

export default ErrorFallback;
