import React from "react";

const WorkBooks = React.lazy(() => import("../pages/workbook/WorkBooks"));

const routes = [
    {
        key: "workbook", // unique value for map
        path: "/workbook", // route path
        exact: false, // exact path
        component: WorkBooks
    },
];

export default routes;
