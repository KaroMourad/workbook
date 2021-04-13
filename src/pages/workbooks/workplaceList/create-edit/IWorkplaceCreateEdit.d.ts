export interface IWorkplaceCreateEditProps {
    isCreate: boolean;
    close: () => void;
    getData: () => void;
    id?: string;
    workBookId: string;
    usedDates: {id: string; startDate: number; endDate: number | null}[];
}