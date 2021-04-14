import React, {CSSProperties} from "react";

export interface ISelectProps
{
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    style?: CSSProperties;
}
