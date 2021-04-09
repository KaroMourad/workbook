import React from "react";
import PulseLoader from "../pulseLoader/PulseLoader";
import {IButtonProps} from "./IButton";

const Button = (props: IButtonProps): JSX.Element =>
{
    const {children = null, type = "button", disabled, className, processing, onClick} = props;
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className + (processing ? "processingBtn" : "")}
        >
            {children}
            {processing ? <PulseLoader/> : null}
        </button>
    );
};

export default Button;
