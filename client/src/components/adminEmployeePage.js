import React from 'react';
import EmployeeForm from './employeeForm';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';

const ViewEmployees = props => (
    <div className="row">
        {props.employees.map(employee => <EmployeeCard key={employee.id} title={employee.name} id={employee.id} email={employee.email} isAdmin={employee.isAdmin} handleTogglePermission={props.handleTogglePermission} />)}
    </div>
)

const EmployeeCard = props => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail" >
            <div className="caption">
                <h3 className="card-title">{props.title}</h3>
                <p><strong>Email: {props.email} </strong></p>
                <p><strong>Admin Rights? {props.isAdmin ? "Yes" : "No"} </strong></p>
            </div>
            <div>
                <button className={`btn ${props.isAdmin ? 'btn-danger' : 'btn-success'}`} onClick={props.handleTogglePermission} data-id={props.id} data-is-admin={props.isAdmin}>{props.isAdmin ? 'Revoke Admin' : 'Make Admin'}</button>
            </div>
        </div>
    </div>
);

class AdminEmployeePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            interval: 0
        }

    }

    componentWillMount = () => {
        Axios.get('/api/v1/employees/all')
            .then(result => this.setState({ employees: result.data }));

    }

    componentDidMount = () => {
        let x = setInterval(() => {
            Axios.get('/api/v1/employees/all')
                .then(result => this.setState({ employees: result.data }))
        }, 15000);
        this.setState({ interval: x });
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

    handleTogglePermission = event => {
        const id = event.target.getAttribute('data-id');
        const isAdmin = event.target.getAttribute('data-is-admin');
        Axios.put('/api/v1/employees/togglepermission', {
            id,
            isAdmin
        })
            .then(result => {
                Axios.get('/api/v1/employees/all')
                    .then(result => this.setState({ employees: result.data }));
            })
    }

    render = props => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/employees/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/employees/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/employees/create" component={EmployeeForm} />
            <Route path="/admin/employees/view" component={() => <ViewEmployees employees={this.state.employees} handleTogglePermission={this.handleTogglePermission} />} />
        </div>
    )
}
export default AdminEmployeePage;