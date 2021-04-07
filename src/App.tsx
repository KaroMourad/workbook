import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Login from './pages/login/Login';
import "./initializeFirebase";

function App()
{
  return (
      <React.Suspense fallback={<span>Loading...</span>}>
          <Router>
              <Switch>
                  <Route exact path={"/login"} component={Login} />
                  <Redirect to={"/login"} />
              </Switch>
          </Router>
      </React.Suspense>
    // <div className="App">
    //   <header className="App-header">
    //
    //   </header>
    // </div>
  );
}

export default App;
