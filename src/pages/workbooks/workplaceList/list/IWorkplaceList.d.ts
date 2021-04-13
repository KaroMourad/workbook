export interface IWorkplaceListProps
{
}

export interface IWorkplace {
    id?: string;
    created_at?: number;
    company: string;
    country: string;
    startDate: number | null;
    endDate: number | null;
    workbookId: string;
}