import React from "react";

const Login = React.lazy(() => import("../pages/login/Login"));

export default [
    {
        key: "login", // unique value for map
        path: "/login", // route path
        exact: false, // exact path
        Component: Login
    },
    {
        key: "workbook", // unique value for map
        path: "/workbook", // route path
        exact: false, // exact path
        Component: Login
    },
];