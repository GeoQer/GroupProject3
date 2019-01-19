import React from "react";
import Employee from "./components/employee";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from "./components/admin";
import LoginPage from "./components/loginPage";

const App = (props) => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={LoginPage} />
                    <Route path="/admin" component={Admin} />
                    <Route exact path="/employee" component={Employee} />
                    <Route component={() => <h1>404: Page Not Found, go back you<strong> big idiot!</strong></h1>} />
                </Switch>
            </div>
        </Router>
    )
}

export default App;
