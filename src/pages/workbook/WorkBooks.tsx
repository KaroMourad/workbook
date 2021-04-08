import React, {FC} from "react";
import ErrorFallback from "../../components/errorFallback/ErrorFallback";
import {ErrorBoundary} from "../../components/errorBoundary/ErrorBoundary";
import {IWorkBooksProps} from "./IWorkBooks";
import {useRouteMatch} from "react-router-dom";

const WorkBooks: FC<IWorkBooksProps> = (props): JSX.Element =>
{
    let match = useRouteMatch();
    console.log(match);
    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            {/*<Router>*/}
            {/*    <Switch>*/}
            {/*        <Redirect to={}*/}
            {/*    </Switch>*/}
            {/*</Router>*/}

            <div>
                WorkBooks
            </div>
        </ErrorBoundary>
    );
};

export default WorkBooks;
