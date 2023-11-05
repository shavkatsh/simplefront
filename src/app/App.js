// /* eslint-disable */
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./hooks/useAuth";
import LanguageProvider from "./hooks/useLanguage";

import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Main from "./layouts/main";
import Title from "./components/ui/title";

function App() {
    return (
        <div>
            <AuthProvider>
                <LanguageProvider>
                    <Title />
                    <Switch>
                        <Route path="/" exact component={Main} />
                        <Redirect to="/" />
                    </Switch>
                    <ToastContainer />
                </LanguageProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
