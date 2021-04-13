import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {IWorkbookListProps} from "./IWorkbookList";
import {ErrorBoundary} from "../../../../components/errorBoundary/ErrorBoundary";
import ErrorFallback from "../../../../components/errorFallback/ErrorFallback";
import {
   deleteWorkbooks,
   getWorkbooks,
} from "../../../../services/workbookApi/workbookApi";
import {notify} from "../../../../services/notify/Notify";
import "./workbookList.css";
import Loader from "../../../../components/loader/Loader";
import Button from "../../../../components/button/Button";
import { useHistory, useLocation } from "react-router-dom";
import {IWorkbook} from "../../IWorkBooks";
import Modal from "../../../../components/modal/Modal";
import WorkbookCreateEdit from "../create-edit/WorkbookCreateEdit";
import DataTable from "react-data-table-component";

const WorkbookList: FC<IWorkbookListProps> = (props: IWorkbookListProps): JSX.Element =>
{
   const history = useHistory();
   const location = useLocation();

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
      (async () => {
         try {
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
            setWorkbooks( prevWorkbooks => data);
         }
         catch (error) {notify(error.message, "danger")}
         finally {setProcessing(false)}
      })()
   },[]);

   const handleViewWorkBook = (id?: string): void =>
   {
      if(id)
      {
         history.push(`${location.pathname}/${id}`);
      }
   };

   // Toggle the state so React Table changes to `clearSelectedRows` are triggered
   const handleClearRows = useCallback(() =>
   {
      setSelectedWorkbookIds([]);
      setToggledClearRows(prevState => !prevState);
   },[]);

   const handleChangeSelectedRows = useCallback((state: {
      allSelected: boolean;
      selectedCount: number;
      selectedRows: IWorkbook[];
   }) =>
   {
      setSelectedWorkbookIds( prevState => state.selectedRows.map(item => item.id as any))
   },[]);

   const handleDeleteWorkBook = useCallback((ids: string[]): void =>
   {
      setDeleteProcessing(true);
      (async (ids) => {
         try {
            await deleteWorkbooks(ids);
            handleClearRows();
            notify("Document successfully deleted!", "success");
            getData()
         }
         catch (error) {notify(error.message, "danger")}
         finally {setDeleteProcessing(false)}
      })(ids)
   },[getData, handleClearRows]);


   const columns = useMemo(() => [
      {
         name: "Created",
         selector: "created_at",
         format: (row: any) => new Date(row.created_at).toDateString(),
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
         format: (row: any) => new Date(row.birthdate).toDateString(),
      }
   ],[]);

   // side effects

   useEffect(() =>
   {
      getData();
   },[getData]);

   return (
       <ErrorBoundary fallback={<ErrorFallback />} >
         <main className={"workBookListContainer"}>
            {processing ? <Loader /> : (
                <>
                   <header>
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
                          disabled={selectedWorkbookIds.length !== 1 || deleteProcessing}
                          style={{backgroundColor: "#6271ba", marginLeft: 10}}
                          onClick={(e) => handleViewWorkBook(selectedWorkbookIds[0])}>
                         View
                      </Button>
                      <Button
                          disabled={selectedWorkbookIds.length === 0}
                          processing={deleteProcessing}
                          style={{backgroundColor: "black", marginLeft: 10}}
                          onClick={(e) => handleDeleteWorkBook(selectedWorkbookIds)}>
                         Delete
                      </Button>
                   </header>
                   <Modal
                       isOpen={!!openCreateEditModal}
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