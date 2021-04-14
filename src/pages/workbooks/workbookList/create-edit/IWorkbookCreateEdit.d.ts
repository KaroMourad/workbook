export interface IWorkbookCreateEditProps
{
    isCreate: boolean;
    close: () => void;
    getData: () => void;
    id?: string;
}
