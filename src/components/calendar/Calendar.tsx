import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import DatePicker from "react-datepicker";
import {ICalendarProps} from "./ICalendar";
import "./calendar.css";
import {notify} from "../../services/notify/Notify";
import {validateRange} from "../../services/validation/Validations";

const Calendar: FC<ICalendarProps> = ({
  range,
  htmlForName,
  onChange,
  selected,
  minDate,
  maxDate,
  className,
  start = null,
  end = null,
  onChangeStartDate,
  onChangeEndDate,
  disabledRangeDates = []
}): JSX.Element =>
{
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const sortedDisabledDates = useMemo( () => {
        return disabledRangeDates.sort((a, b) => a.startDate - b.startDate)
    }, [disabledRangeDates]);

    useEffect(() =>
    {
        if (range)
        {
            setStartDate(start);
            setEndDate(end);
        }
    }, [start, end, range]);

    debugger;
    const filterDate = useCallback((date: Date): boolean =>
    {
        const timestamp = date.valueOf();

        for (let dates of sortedDisabledDates)
        {
            if (timestamp > dates.startDate)
            {
                if (dates.endDate)
                {
                    if (timestamp < dates.endDate) return false;
                } else
                {
                    if (timestamp > Date.now()) return false;
                }
            }
        }
        return true;
    }, [sortedDisabledDates]);

    const onChangeStart = useCallback((date: Date | null): void =>
    {
        onChangeStartDate?.(date);
        if (endDate && date && date > endDate)
        {
            setEndDate(null);
            onChangeEndDate?.(null);
        }
    }, [endDate, onChangeStartDate, onChangeEndDate]);

    const onChangeEnd = useCallback((date: Date | null): void =>
    {
        if (startDate && date)
        {
            const validEndDate: boolean = validateRange(sortedDisabledDates, startDate.valueOf(), date.valueOf());
            if(validEndDate)
            {
                setEndDate(date);
                onChangeEndDate?.(date);
            }
            else {
                notify("Range cannot include another date range!","danger");
                setEndDate(null);
                onChangeEndDate?.(null);
            }
        }
    },[startDate, onChangeEndDate, sortedDisabledDates]);

    if (range)
    {
        return (
            <div style={{display: "flex"}}>
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={startDate}
                    onChange={(date) => onChangeStart(date as Date || null)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    filterDate={filterDate}
                    popperPlacement={"top-start"}
                />
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={endDate}
                    onChange={(date) => onChangeEnd(date as Date || null)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    filterDate={filterDate}
                    popperPlacement={"top-end"}
                />
            </div>
        );
    } else
    {
        return (
            <DatePicker
                className={className}
                name={htmlForName}
                maxDate={maxDate}
                minDate={minDate}
                selected={selected}
                onChange={(date) => onChange?.(date as Date || null)}
                popperPlacement={"bottom-end"}
            />
        );
    }
};

export default Calendar;
