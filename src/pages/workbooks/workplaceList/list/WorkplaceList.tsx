import React, {FC, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ErrorBoundary} from "../../../../components/errorBoundary/ErrorBoundary";
import ErrorFallback from "../../../../components/errorFallback/ErrorFallback";
import Loader from "../../../../components/loader/Loader";
import Button from "../../../../components/button/Button";
import "./workplaceList.css";
import {IWorkplace, IWorkplaceListProps} from "./IWorkplaceList";
import {Link, useParams} from "react-router-dom";
import Modal from "../../../../components/modal/Modal";
import {notify} from "../../../../services/notify/Notify";
import {deleteWorkplaces, getWorkplaces} from "../../../../services/api/workplaceApi/workplaceApi";
import WorkplaceCreateEdit from "../create-edit/WorkplaceCreateEdit";
import DataTable from "react-data-table-component";
import {UserContext} from "../../../../context/userContext/UserProvider";

const WorkplaceList: FC<IWorkplaceListProps> = (props: IWorkplaceListProps): JSX.Element =>
{
    const {user} = useContext(UserContext);
    const token: boolean = user?.super;
    const params = useParams<{ id: string }>();
    const workBookId: string = params.id;

    const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
    const [processing, setProcessing] = useState<boolean>(true);
    const [deleteProcessing, setDeleteProcessing] = useState<boolean>(false);
    const [selectedWorkplaceIds, setSelectedWorkplaceIds] = useState<string[]>([]);
    const [openCreateEditModal, setOpenCreateEditModal] = useState<"create" | "edit" | false>(false);
    const [toggledClearRows, setToggledClearRows] = useState<boolean>(false);
    const [usedDates, setUsedDates] = useState<{ id: string; startDate: number; endDate: number | null }[]>([]);

    // memoization hooks

    const getData = useCallback((): void =>
    {
        setProcessing(true);
        (async () =>
        {
            try
            {
                const querySnapshot = await getWorkplaces(workBookId);
                let data: IWorkplace[] = [];
                let dates: { id: string; startDate: number; endDate: number | null }[] = [];
                // firebase Api
                querySnapshot.forEach((doc) =>
                {
                    // doc.data() is never undefined for query doc snapshots
                    const docData = doc.data() as IWorkplace;
                    data.push({
                        id: doc.id,
                        ...docData
                    });
                    dates.push({
                        id: doc.id,
                        startDate: docData.startDate as number,
                        endDate: docData.endDate || null
                    });
                });
                setUsedDates(prevState => dates);
                setWorkplaces(prevState => data);
            } catch (error)
            {
                notify(error.message, "danger");
            } finally
            {
                setProcessing(false);
            }
        })();
    }, [workBookId]);

    // Toggle the state so React Table changes to `clearSelectedRows` are triggered
    const handleClearRows = useCallback(() =>
    {
        setSelectedWorkplaceIds([]);
        setToggledClearRows(prevState => !prevState);
    }, []);

    const handleChangeSelectedRows = useCallback((state: {
        allSelected: boolean;
        selectedCount: number;
        selectedRows: IWorkplace[];
    }) =>
    {
        setSelectedWorkplaceIds(prevState => state.selectedRows.map(item => item.id as any));
    }, []);

    const handleDeleteWorkPlace = useCallback((ids: string[]): void =>
    {
        setDeleteProcessing(true);
        (async (ids) =>
        {
            try
            {
                await deleteWorkplaces(token, ids);
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

    const columns = useMemo(() => [
        {
            name: "Created",
            selector: "created_at",
            format: (row: IWorkplace) => new Date(row.created_at as number).toDateString(),
            sortable: true
        },
        {
            name: "Company",
            selector: "company",
        },
        {
            name: "Country",
            selector: "country",
        },
        {
            name: "StartDate",
            selector: "startDate",
            format: (row: IWorkplace) => new Date(row.startDate as number).toDateString()
        },
        {
            name: "EndDate",
            selector: "endDate",
            format: (row: IWorkplace) => row.endDate ? new Date(row.endDate).toDateString() : "--",
        }
    ], []);

    // side effects

    useEffect(() =>
    {
        getData();
    }, [getData]);

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <main className={"workplaceListContainer"}>
                {processing ? <Loader/> : (
                    <>
                        <header>
                            <Link to={"/workbooks"}>{" < back "}</Link>
                            {token ? (
                                <>
                                    <Button
                                        disabled={selectedWorkplaceIds.length > 0 || deleteProcessing}
                                        style={{minWidth: 85, marginLeft: "auto"}}
                                        onClick={() => setOpenCreateEditModal("create")}>
                                        Create
                                    </Button>
                                    <Button
                                        disabled={selectedWorkplaceIds.length !== 1 || deleteProcessing}
                                        style={{backgroundColor: "#4caaaf", marginLeft: 10}}
                                        onClick={() => setOpenCreateEditModal("edit")}>
                                        Edit
                                    </Button>
                                    <Button
                                        disabled={selectedWorkplaceIds.length === 0}
                                        processing={deleteProcessing}
                                        style={{backgroundColor: "black", marginLeft: 10}}
                                        onClick={(e) => handleDeleteWorkPlace(selectedWorkplaceIds)}>
                                        Delete
                                    </Button>
                                </>
                            ) : null}
                        </header>
                        <Modal
                            isOpen={token && !!openCreateEditModal}
                            onRequestClose={() => setOpenCreateEditModal(false)}
                            contentLabel={(openCreateEditModal === "create" ? "Create" : "Edit") + " Workplace"}
                        >
                            <WorkplaceCreateEdit
                                isCreate={openCreateEditModal === "create"}
                                getData={getData}
                                usedDates={usedDates}
                                workBookId={workBookId}
                                id={selectedWorkplaceIds.length === 0 ? undefined : selectedWorkplaceIds[0]}
                                close={() => setOpenCreateEditModal(false)}
                            />
                        </Modal>
                        <div className={"workplaceDataTable"}>
                            <DataTable
                                title="Workplaces"
                                columns={columns}
                                data={workplaces}
                                striped
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

export default WorkplaceList;
