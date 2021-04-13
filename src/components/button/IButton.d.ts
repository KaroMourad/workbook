import React, {MouseEvent, ReactNode} from "react";

export interface IButtonProps
{
    children?: ReactNode;
    type?: "submit" | "reset" | "button";
    disabled?: boolean;
    className?: string;
    processing?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    style?: React.CSSProperties;
}
