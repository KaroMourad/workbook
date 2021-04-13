import React from "react";
import {IRoutes} from "./IRoutes";

const WorkBooks = React.lazy(() => import("../pages/workbooks/WorkBooks"));

const routes: IRoutes[] = [
    {
        key: "workbooks", // unique value for map
        path: "/workbooks", // route path
        exact: false, // exact path
        component: WorkBooks
    },
    // add routes here
];

export default routes;
