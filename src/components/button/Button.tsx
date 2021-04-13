import React, {FC} from "react";
import PulseLoader from "../pulseLoader/PulseLoader";
import {IButtonProps} from "./IButton";
import "./button.css";

const Button: FC<IButtonProps> = (props: IButtonProps): JSX.Element =>
{
    const {children = null, type = "button", disabled, className = "", processing, onClick, style = {}} = props;

    const btnClassName:string = className + (processing ? " processingBtn" : "") + (disabled ? " disabled" : "");
    return (
        <button
            type={type}
            onClick={processing ? undefined : onClick}
            disabled={disabled}
            className={"button " + btnClassName}
            style={style}
        >
            {children}
            {processing ? <PulseLoader/> : null}
        </button>
    );
};

export default Button;
