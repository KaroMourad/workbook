import React from "react";
import "./App.css";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import Login from "./pages/login/Login";
import "./firebase/initializeFirebase";
import useAuth from "./firebase/Auth";
import routes from "./routes/routes";
import {ErrorBoundary} from "./components/errorBoundary/ErrorBoundary";
import ErrorFallback from "./components/errorFallback/ErrorFallback";
import WorkBooks from "./pages/workbook/WorkBooks";

function App(): JSX.Element
{
    // auth custom hook
    const [userData, setUserData] = useAuth();

    console.log("userData ------ ", userData);

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <React.Suspense fallback={<span>Loading...</span>}>
                <Router>
                    <Switch>
                        <Route exact path={"/login"} component={Login}/>
                        {
                            userData ? (
                                routes.map((route, i) =>
                                {
                                    const {key, path, component, exact} = route;
                                    return <Route key={key} exact={exact} path={path} component={component}/>;
                                })
                            ) : null
                        }
                        <Redirect to={"/login"}/>
                    </Switch>
                </Router>
            </React.Suspense>
        </ErrorBoundary>
    );
}

export default App;
