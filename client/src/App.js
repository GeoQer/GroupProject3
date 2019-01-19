import React from "react";
import Employee from "./components/employee";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from "./components/admin";
import LoginPage from "./components/loginPage";
import Notfound from "./components/Notfound";

const App = (props) => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={LoginPage} />
                    <Route path="/admin" component={Admin} />
                    <Route exact path="/employee" component={Employee} />
                    <Route component={Notfound}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App;
