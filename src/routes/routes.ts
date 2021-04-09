import React from "react";
import {IRoutes} from "./IRoutes";

const WorkBooks = React.lazy(() => import("../pages/workbook/WorkBooks"));

const routes: IRoutes[] = [
    {
        key: "workbook", // unique value for map
        path: "/workbook", // route path
        exact: false, // exact path
        component: WorkBooks
    },
];

export default routes;
