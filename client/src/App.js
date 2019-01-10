import React from "react";
import Employee from "./components/employee";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Admin from "./components/admin";
import LoginPage from "./components/loginPage";

const App = (props) => {
    return (
        <Router>
            <div>
                <Route exact path="/" component={LoginPage} />
                <Route path="/admin" component={Admin} />
                <Route exact path="/employee" component={Employee} />
            </div>
        </Router>
    )
}

export default App;
