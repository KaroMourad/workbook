import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import DatePicker from "react-datepicker";
import {ICalendarProps} from "./ICalendar";
import "./calendar.css";
import {notify} from "../../../services/notify/Notify";
import {validateRange, validateStartDate} from "../../../services/validation/Validations";

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

    useEffect(() =>
    {
        if (range)
        {
            setStartDate(start);
            setEndDate(end);
        }
    }, [start, end, range]);

    const sortedDisabledDates = useMemo(() =>
    {
        return disabledRangeDates.sort((a, b) => a.startDate - b.startDate);
    }, [disabledRangeDates]);

    const filterDate = useCallback((date: Date): boolean =>
    {
        const timestamp = date.valueOf();

        for (let dates of sortedDisabledDates)
        {
            if (timestamp >= dates.startDate)
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

    const onChangeStart = useCallback((date: Date | null, end: Date | null): void =>
    {
        setStartDate(date);
        onChangeStartDate?.(date);

        if (!validateStartDate(date, end))
        {
            setEndDate(null);
            onChangeEndDate?.(null);
        }
        if (end && date)
        {
            const validRange: boolean = validateRange(sortedDisabledDates, date.valueOf(), end.valueOf());
            if (validRange)
            {
                onChangeStartDate?.(date);
            } else
            {
                notify("Range cannot include another date range!", "danger");
                setStartDate(null);
                onChangeStartDate?.(null);
            }
        }
    }, [sortedDisabledDates, onChangeStartDate, onChangeEndDate]);

    const onChangeEnd = useCallback((date: Date | null, start: Date | null): void =>
    {
        setEndDate(date);
        onChangeEndDate?.(date);

        if (start && date)
        {
            const validRange: boolean = validateRange(sortedDisabledDates, start.valueOf(), date.valueOf());
            if (validRange)
            {
                onChangeEndDate?.(date);
            } else
            {
                notify("Range cannot include another date range!", "danger");
                setEndDate(null);
                onChangeEndDate?.(null);
            }
        }
    }, [onChangeEndDate, sortedDisabledDates]);

    if (range)
    {
        return (
            <div style={{display: "flex"}}>
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={startDate}
                    onChange={(date: Date | null) => onChangeStart(date ? new Date(date.setHours(0, 0, 0, 0)) : null, endDate)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    filterDate={filterDate}
                    popperPlacement={"top-start"}
                />
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={endDate}
                    onChange={(date: Date | null) => onChangeEnd(date ? new Date(date.setHours(23, 59, 59, 999)) : null, startDate)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
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
