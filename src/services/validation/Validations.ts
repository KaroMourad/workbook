export const emailPattern: string = `^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`;
export const onlyLettersPattern: string = `^[a-zA-Z]+$`;
export const alphanumericPattern: string = `^[a-zA-Z0-9]+$`;

const date = new Date();
date.setFullYear(date.getFullYear() - 18);
export const minBirthDate: Date = date;

export const validateOnlyLetters = (value: string, pattern?: string): boolean =>
{
    return RegExp(pattern || onlyLettersPattern).test(String(value));
};

export const validateAlphanumeric = (value: string, pattern?: string): boolean =>
{
    return RegExp(pattern || alphanumericPattern).test(String(value));
};

export const validateEmail = (value: string, pattern?: string): boolean =>
{
    return RegExp(pattern || emailPattern).test(String(value).toLowerCase());
};

export const validatePassword = (value: string): boolean =>
{
    return String(value).length > 6;
};

export const validateBirthdate = (value: Date): boolean =>
{
    return value < minBirthDate;
};

export const validateStartDate = (startDate: Date | null, endDate: Date | null): boolean =>
{
    return !!endDate && !!startDate && startDate < endDate;
};

export const validateRange = (disabledDates: { startDate: number; endDate: number | null }[], startDate: number, endDate: number): boolean => {
    for (let date of disabledDates)
    {
        if (startDate <= date.startDate && date.endDate && endDate >= date.endDate) {
            return false;
        }
    }
    return true;
};