import React, {useContext} from "react";
import "./App.css";
import {Redirect, Route, Switch,} from "react-router-dom";
import "./firebase/initializeFirebase";
import Login from "./pages/login/Login";
import routes from "./routes/routes";
import {ErrorBoundary} from "./components/errorBoundary/ErrorBoundary";
import ErrorFallback from "./components/errorFallback/ErrorFallback";
import Loader from "./components/loader/Loader";
import {UserContext} from "./context/userContext/UserProvider";
import ReactNotification from "react-notifications-component";

import "react-notifications-component/dist/theme.css";
import "react-datepicker/dist/react-datepicker.css";

const App = (): JSX.Element =>
{
    const userContext = useContext(UserContext);
    const {isLoaded, user} = userContext;

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <div className="appContainer">
                <ReactNotification />
                {isLoaded ? (
                    <React.Suspense fallback={<Loader/>}>
                        <Switch>
                            {
                                user ? (
                                    routes.map((route, i) => <Route {...route}/>)
                                ) : <Route exact path={"/login"} component={Login}/>
                            }
                            <Redirect to={user ? routes[0].path : "/login"}/>
                        </Switch>
                    </React.Suspense>
                ) : <Loader/>}
            </div>
        </ErrorBoundary>
    );
}

export default App;
