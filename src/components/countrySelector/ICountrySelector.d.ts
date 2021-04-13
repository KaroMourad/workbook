import {CSSProperties} from "react";

export interface ICountrySelectorProps
{
    country: string | undefined;
    onChange: (value: string) => void;
    label?: string;
    style?: CSSProperties;
    labelStyle?: CSSProperties;
}