import React from "react";
import Employee from "./components/employee";
import PartForm from "./components/partForm";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from "./components/loginPage";

const App = (props) => {
    return(
        <Router>
            <div>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/employee" component={Employee} />
                <Route exact path="/admin/createpart" component={PartForm} />
            </div>
        </Router>
    )
}

export default App;
