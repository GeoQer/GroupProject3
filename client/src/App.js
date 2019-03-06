import React from "react";
import Employee from "./components/employee";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from "./material_pages/admin/Admin";
import Login from "./material_pages/login/Login";
import Notfound from "./components/Notfound";
import 'materialize-css/dist/css/materialize.min.css';

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/admin" component={Admin} />
                    <Route exact path="/employee" component={Employee} />
                    <Route component={Notfound}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App;
