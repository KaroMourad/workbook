import React, {useContext} from "react";
import "./App.css";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import Login from "./pages/login/Login";
import "./firebase/initializeFirebase";
import routes from "./routes/routes";
import {ErrorBoundary} from "./components/errorBoundary/ErrorBoundary";
import ErrorFallback from "./components/errorFallback/ErrorFallback";
import Loader from "./components/spinner/Loader";
import {UserContext} from "./context/userContext/UserProvider";

function App(): JSX.Element
{
    const userContext = useContext(UserContext);
    const {isLoaded, user} = userContext;

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <div className="appContainer">
                {isLoaded ? (
                    <React.Suspense fallback={<Loader/>}>
                        <Router>
                            <Switch>
                                {
                                    user ? (
                                        routes.map((route, i) => <Route {...route}/>)
                                    ) : <Route exact path={"/login"} component={Login}/>
                                }
                                <Redirect to={user ? "/workbook" : "/login"}/>
                            </Switch>
                        </Router>
                    </React.Suspense>
                ) : <Loader/>}
            </div>
        </ErrorBoundary>
    );
}

export default App;
