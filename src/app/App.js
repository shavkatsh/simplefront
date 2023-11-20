// /* eslint-disable */
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./layouts/main";

function App() {
    return (
        <div>
            <h1>Simple App</h1>
            <h3>
                REACT_APP_SERVER_API_URL ={" "}
                {process.env.REACT_APP_SERVER_API_URL}{" "}
            </h3>
            <Switch>
                <Route path="/" exact component={Main} />
                <Redirect to="/" />
            </Switch>
        </div>
    );
}

export default App;
