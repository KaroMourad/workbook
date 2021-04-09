import {ReactComponentElement} from "react";

interface IRoutes
{
    key: string;
    path: string;
    exact?: boolean,
    component: ReactComponentElement;
}
