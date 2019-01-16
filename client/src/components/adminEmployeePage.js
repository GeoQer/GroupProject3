import React from 'react';
import EmployeeForm from './employeeForm';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';
const firebase = require('firebase/app');
require('firebase/storage');
 /* var config = {
    apiKey: "AIzaSyAZB-qbjpKVRvaQt17kPsPTMav3O12by6k",
    authDomain: "project-runner-f1bdc.firebaseapp.com",
    databaseURL: "https://project-runner-f1bdc.firebaseio.com",
    projectId: "project-runner-f1bdc",
    storageBucket: "project-runner-f1bdc.appspot.com",
    messagingSenderId: "757776283780"
}; */ 
//firebase.initializeApp(config);

const ViewEmployees  = props => (
    <div className="row">
        {props.employees.map(employee => <EmployeeCard key={employee.id} title={employee.name} email={employee.email}/> )}
    </div>
)

const EmployeeCard = props => (
   <div className="col-sm-6 col-md-4">
        <div className="thumbnail" >
            <div className="caption">
                <h3 className="card-title">{props.name}</h3>
                <p><strong>ID: {props.id} </strong></p>
                <p><strong>Email: {props.email} </strong></p>
            </div>
        </div>
    </div>
);

class AdminEmployeePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        employees: []
        }

    }

    componentDidMount = () => {
        Axios.get('/api/v1/users/all')
            .then(result => this.setState({employees: result.data}));
        let x = setInterval(() => {
            Axios.get('/api/v1/users/all')
            .then(result => this.setState({employees: result.data}))
        }, 15000);
        this.setState({interval: x});    
    }
    componentWillUnmount = () => {
        clearInterval(this.state.interval);
    }
    

    handleTabSelect = (event) => {
        const target = event.target;
        const tabs = document.getElementsByClassName('tab-link');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].setAttribute('class', 'tab-link');
        }
        target.parentElement.setAttribute('class', 'active tab-link');
    }
    render = props => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/employees/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/employees/edit">Edit</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/employees/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/employees/create" component={EmployeeForm} />
            <Route path="/admin/employees/view" component={() => <ViewEmployees employees={this.state.employees} />} />
        </div>
    )
}
export default AdminEmployeePage;