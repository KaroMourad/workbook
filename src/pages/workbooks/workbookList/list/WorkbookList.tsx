import React, {FC, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {IWorkbookListProps} from "./IWorkbookList";
import {ErrorBoundary} from "../../../../components/errorBoundary/ErrorBoundary";
import ErrorFallback from "../../../../components/errorFallback/ErrorFallback";
import {deleteWorkbooks, getWorkbooks,} from "../../../../services/api/workbookApi/workbookApi";
import {notify} from "../../../../services/notify/Notify";
import "./workbookList.css";
import Loader from "../../../../components/loader/Loader";
import Button from "../../../../components/button/Button";
import {useHistory, useLocation} from "react-router-dom";
import {IWorkbook} from "../../IWorkBooks";
import Modal from "../../../../components/modal/Modal";
import WorkbookCreateEdit from "../create-edit/WorkbookCreateEdit";
import DataTable, {IDataTableColumn} from "react-data-table-component";
import {UserContext} from "../../../../context/userContext/UserProvider";

const WorkbookList: FC<IWorkbookListProps> = (props: IWorkbookListProps): JSX.Element =>
{
    const history = useHistory();
    const location = useLocation();
    const {user} = useContext(UserContext);
    const token: boolean = user?.super;

    const [workbooks, setWorkbooks] = useState<IWorkbook[]>([]);
    const [processing, setProcessing] = useState<boolean>(true);
    const [deleteProcessing, setDeleteProcessing] = useState<boolean>(false);
    const [selectedWorkbookIds, setSelectedWorkbookIds] = useState<string[]>([]);
    const [openCreateEditModal, setOpenCreateEditModal] = useState<"create" | "edit" | false>(false);
    const [toggledClearRows, setToggledClearRows] = useState<boolean>(false);

    // memoization hooks

    const getData = useCallback((): void =>
    {
        setProcessing(true);
        (async () =>
        {
            try
            {
                const querySnapshot = await getWorkbooks();
                let data: IWorkbook[] = [];
                // firebase Api
                querySnapshot.forEach((doc) =>
                {
                    // doc.data() is never undefined for query doc snapshots
                    data.push({
                        id: doc.id,
                        ...(doc.data() as IWorkbook)
                    });
                });
                setProcessing(false);
                setWorkbooks(prevWorkbooks => data);
            } catch (error)
            {
                notify(error.message, "danger");
            } finally
            {
                setProcessing(false);
            }
        })();
    }, []);

    // Toggle the state so React Table changes to `clearSelectedRows` are triggered
    const handleClearRows = useCallback(() =>
    {
        setSelectedWorkbookIds([]);
        setToggledClearRows(prevState => !prevState);
    }, []);

    const handleChangeSelectedRows = useCallback((state: {
        allSelected: boolean;
        selectedCount: number;
        selectedRows: IWorkbook[];
    }) =>
    {
        setSelectedWorkbookIds(prevState => state.selectedRows.map(item => item.id as string));
    }, []);

    const handleDeleteWorkBook = useCallback((ids: string[]): void =>
    {
        setDeleteProcessing(true);
        (async (ids) =>
        {
            try
            {
                await deleteWorkbooks(token, ids);
                handleClearRows();
                notify("Document successfully deleted!", "success");
                getData();
            } catch (error)
            {
                notify(error.message, "danger");
            } finally
            {
                setDeleteProcessing(false);
            }
        })(ids);
    }, [getData, token, handleClearRows]);

    // small function doesn't need memoization
    const handleRowClick = (row: IWorkbook): void =>
    {
        if (row.id)
        {
            history.push(`${location.pathname}/${row.id}`);
        }
    }

    const columns = useMemo((): IDataTableColumn<IWorkbook>[]  => [
        {
            name: "Created",
            selector: "created_at",
            format: (row: IWorkbook) => new Date(row.created_at as number).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Firstname",
            selector: "firstname",
        },
        {
            name: "Lastname",
            selector: "lastname",
        },
        {
            name: "Email",
            selector: "email"
        },
        {
            name: "Passport",
            selector: "passport"
        },
        {
            name: "Birthdate",
            selector: "birthdate",
            format: (row: IWorkbook) => new Date(row.birthdate).toLocaleDateString(),
        }
    ], []);

    // side effects

    useEffect(() =>
    {
        getData();
    }, [getData]);

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <main className={"workBookListContainer"}>
                {processing ? <Loader/> : (
                    <>
                        <header>
                            {
                                token ? (
                                    <>
                                        <Button
                                            disabled={selectedWorkbookIds.length > 0 || deleteProcessing}
                                            style={{minWidth: 85, marginLeft: "auto"}}
                                            onClick={() => setOpenCreateEditModal("create")}>
                                            Create
                                        </Button>
                                        <Button
                                            disabled={selectedWorkbookIds.length !== 1 || deleteProcessing}
                                            style={{backgroundColor: "#4caaaf", marginLeft: 10}}
                                            onClick={() => setOpenCreateEditModal("edit")}>
                                            Edit
                                        </Button>
                                        <Button
                                            disabled={selectedWorkbookIds.length === 0}
                                            processing={deleteProcessing}
                                            style={{backgroundColor: "black", marginLeft: 10}}
                                            onClick={(e) => handleDeleteWorkBook(selectedWorkbookIds)}>
                                            Delete
                                        </Button>
                                    </>
                                ) : null
                            }
                        </header>
                        <Modal
                            isOpen={token && !!openCreateEditModal}
                            onRequestClose={() => setOpenCreateEditModal(false)}
                            contentLabel={(openCreateEditModal === "create" ? "Create" : "Edit") + " Workbook"}
                        >
                            <WorkbookCreateEdit
                                isCreate={openCreateEditModal === "create"}
                                getData={getData}
                                id={selectedWorkbookIds.length === 0 ? undefined : selectedWorkbookIds[0]}
                                close={() => setOpenCreateEditModal(false)}
                            />
                        </Modal>
                        <div className={"workbookDataTable"}>
                            <DataTable
                                title="Workbooks"
                                columns={columns}
                                data={workbooks}
                                striped
                                onRowClicked={handleRowClick}
                                pagination
                                style={{height: "100%", overflowY: "auto"}}
                                selectableRowsHighlight
                                highlightOnHover
                                defaultSortField="created_at"
                                selectableRows
                                onSelectedRowsChange={handleChangeSelectedRows}
                                clearSelectedRows={toggledClearRows}
                            />
                        </div>
                    </>
                )}
            </main>
        </ErrorBoundary>
    );
};

export default WorkbookList;
