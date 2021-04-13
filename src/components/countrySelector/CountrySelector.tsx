import React, {useMemo, FC, useEffect, useCallback} from 'react'
import countryList from 'react-select-country-list'
import {ICountrySelectorProps} from "./ICountrySelector";
import Select from "../select/Select";

const CountrySelector: FC<ICountrySelectorProps> = ({
    country= "",
    onChange,
    label,
    style = {},
    labelStyle = {}
}): JSX.Element =>
{
    const options = useMemo(() => countryList().getData(), []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void =>
    {
        const {value} = e.target;

        onChange(value);
    },[onChange]);

    useEffect(() =>
    {
        if(!country)
        {
            onChange(options[0].label);
        }
    },[country, options, onChange])

    return (
        <div>
            {label && <label htmlFor={"select"} style={labelStyle}><b>{label}</b></label>}
            <Select options={options} style={style} value={country} onChange={handleChange} />
        </div>

    );
}

export default CountrySelector