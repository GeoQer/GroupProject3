import React from 'react';
import Axios from 'axios';
//import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import "./partForm.css";
//const firebase = require('firebase/app');
//require('firebase/storage');

class EmployeeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {
                id: '',
                name: '',
                email: '',
                password: '',
                admin: false
            },
           
        }
        Axios.get('/api/v1/stations/all')
            .then(result => this.setState({ stations: result.data, selectedStation: result.data[0] }));
    };

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        this.setState({ selectedStation: { id, name } });
    }

    addEmployee = () => {
        const obj = Object.assign(this.state.employee);
        this.setState({ employee: obj, showModal: false });
    }

    handleInput = (event) => {
        const name = event.target.name;
        let obj = Object.assign(this.state.employee);
        obj[name] = event.target.value;
        this.setState({ employee: obj });
    }

    clear = () => {
        document.getElementById('employee-id').value = '';
        this.setState({ employee: { id: '' } });
    }

     handleSubmit = async () => {
        if (this.state.employee.length < 1) {
            console.log('There is no information to post');
            return;
        }
        else{
            Axios.post('/api/v1/employees/create', {
                employee: {...this.state.employee }
            })
            .catch(err => console.log(err));
        }

    } 

    render() {
        return (
            <div className="container">
                <div className='row'>
                    <div className='col-sm-4'>
                        <form id="employee-form" action="/api/v1/employees/test" method="POST">
                            <div className="input-group">
                                <span className="input-group-addon" id="employee-number-addon">Employee ID</span>
                                <input name="id" id="employee-id" onChange={this.handleInput} type="text" className="form-control" placeholder="If left blank an ID will be auto-generated" aria-describedby="employee-number-addon" />
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon" id="employee-name-addon">Employee Name</span>
                                <input name="name" id="employee-name" onChange={this.handleInput} type="text" className="form-control" placeholder="First and Last Name" aria-describedby="part-name-addon" />
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon" id="employee-email-addon">Employee Email</span>
                                <input name="email" id="employee-email" onChange={this.handleInput} type="email" className="form-control" placeholder="Email" aria-describedby="part-email-addon" />
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon" id="employee-password-addon">Employee Password</span>
                                <input name="password" id="employee-password" onChange={this.handleInput} type="password" className="form-control" placeholder="Password" aria-describedby="part-password-addon" />
                            </div>
                        </form>
                        <br />
                        <hr />
                        <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                        <button className="btn btn-danger" onClick={this.clear}>Clear</button>
                    </div>
                </div>
            </div>
        )
    }
}


export default EmployeeForm;