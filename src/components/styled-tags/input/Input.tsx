import React, {FC} from "react";
import {IInputProps} from "./IInput";
import "./input.css";

const Input: FC<IInputProps> = ({
    value,
    onChange,
    name,
    placeholder,
    type = "text",
    isValid = false,
    validationText,
    style = {},
    labelStyle = {},
    validationStyle = {},
    containerStyle = {},
    label,
    required,
    pattern,
    withValidation = false
}): JSX.Element =>
{
    return (
        <div style={containerStyle}>
            {label && <label htmlFor={name} style={labelStyle}><b>{label}</b></label>}
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                style={style}
                className={"inputStyle"}
                pattern={pattern}
                required={required}
                value={value}
                onChange={onChange}
            />
            {withValidation ? (
                <p style={{marginBottom: 20, paddingLeft: 5, fontSize: 12, ...validationStyle}}
                   className={isValid ? "valid" : "invalid"}>
                    {isValid ? "Valid format" : (value ? validationText : "Empty field, please fill data!")}
                </p>
            ) : null}
        </div>
    );
};

export default Input;
