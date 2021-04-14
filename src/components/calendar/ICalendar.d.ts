export interface ICalendarProps
{
    range: boolean;
    onChange?: (date: Date | null) => void;
    selected?: Date;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    htmlForName?: string;
    start?: Date | null;
    end?: Date | null;
    onChangeStartDate?: (date: Date | null) => void;
    onChangeEndDate?: (date: Date | null) => void;
    disabledRangeDates?: { startDate: number; endDate: number | null }[];
}
