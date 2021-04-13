import React, {FC} from "react";
import ErrorFallback from "../../components/errorFallback/ErrorFallback";
import {ErrorBoundary} from "../../components/errorBoundary/ErrorBoundary";
import {IWorkbooksProps} from "./IWorkBooks";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import Logout from "../../components/logout/Logout";
import "./workbooks.css";

const WorkbookList = React.lazy(() => import("./workbookList/list/WorkbookList"));
const WorkplaceList = React.lazy(() => import("./workplaceList/list/WorkplaceList"));

const WorkBooks: FC<IWorkbooksProps> = (props: IWorkbooksProps): JSX.Element =>
{
    const match = useRouteMatch();

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <section className={"workbooksContainer"}>
                <header>
                    <h1>WorkBook App</h1>
                    <Logout/>
                </header>
                <Switch>
                    <Route exact path={`${match.url}`} component={WorkbookList}/>
                    <Route exact path={`${match.url}/:id`} component={WorkplaceList}/>
                    <Redirect to={match.url}/>
                </Switch>
            </section>
        </ErrorBoundary>
    );
};

export default WorkBooks;
