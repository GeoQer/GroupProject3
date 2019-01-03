import React from "react";
import Employee from "./components/employee";
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = (props) => {
    return(
        <Router>
            <div>
                <Route path="/employee" component={Employee} />
            </div>
        </Router>
    )
}

export default App;
