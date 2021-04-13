import {CSSProperties, InputHTMLAttributes} from "react";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement>
{
    label?: string;
    labelStyle?: CSSProperties;
    isValid?: boolean;
    containerStyle?: CSSProperties;
    validationText?: string;
    validationStyle?: CSSProperties;
    withValidation?: boolean;
}