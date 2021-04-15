import React, {FC} from "react";
import {ISelectProps} from "./ISelect";
import "./select.css";

const Select: FC<ISelectProps> = ({
  options,
  value,
  onChange,
  style
}): JSX.Element =>
{
    return (
        <div className={"custom-select"}>
            <select className={"selectStyle"} name={"select"} value={value} onChange={onChange} style={style}>
                {options.map(option =>
                {
                    return (
                        <option key={option.value} value={option.label}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>

    );
};

export default Select;
