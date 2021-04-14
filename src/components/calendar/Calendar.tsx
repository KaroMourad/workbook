import React, {FC, useCallback, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {ICalendarProps} from "./ICalendar";

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

    const filterDate = useCallback((date: Date): boolean =>
    {
        const timestamp = date.valueOf();

        for (let dates of disabledRangeDates)
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

        if (startDate && !endDate)
        {
            //startDate
        }

        if (endDate && !startDate)
        {

        }
        return true;
    }, [disabledRangeDates, startDate, endDate]);

    const onChangeStart = useCallback((date: Date | null): void =>
    {
        onChangeStartDate?.(date);
        if (endDate && date && date > endDate)
        {
            setEndDate(null);
            onChangeEndDate?.(null);
        }
    }, [endDate, onChangeStartDate, onChangeEndDate]);

    if (range)
    {
        return (
            <>
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={startDate}
                    onChange={(date) => onChangeStart(date as Date || null)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    filterDate={filterDate}
                />
                <DatePicker
                    className={className}
                    name={htmlForName}
                    selected={endDate}
                    onChange={(date) => onChangeEndDate?.(date as Date || null)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    filterDate={filterDate}
                />
            </>
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
            />
        );
    }
};

export default Calendar;
