import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';

export default class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: null,
            name: '',
            email: '',
            password: '',
            err: null
        }
    }

    componentDidMount = () => {
        this.handleRefresh();
        const modal = document.getElementById('modal');
        M.Modal.init(modal);
    }

    handleRefresh = () => {
        Axios.get('/api/v1/employees/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ employees: result.data })
            })
    }

    toggleAdmin = employee => {
        this.setState({ err: null })
        try {
            if (employee.isAdmin) {
                let count = 0;
                this.state.employees.forEach(emp => {
                    if (emp.isAdmin)
                        count++;
                })
                if (count <= 1) {
                    throw new Error({ message: 'There must always be at least one user with Administrator privileges.' });
                }
            }

            Axios.put('/api/v1/employees/togglepermission', {
                id: employee.id,
                isAdmin: employee.isAdmin
            })
                .then(result => {
                    if (result.data.err) {
                        this.setState({ err: result.data.err });
                        return;
                    }
                    this.handleRefresh();
                })
                .catch(err => this.setState({ err }));
        }
        catch (err) {
            this.setState({ err })
        }
    }

    handleDelete = id => {
        Axios.put(`/api/v1/employees/archive/${id}`)
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                this.handleRefresh();
            })
    }

    showModal = event => {
        event.preventDefault();
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    hideModal = () => {
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstanceI(modal);
        instance.close();
    }

    handleTextChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value, modalErr: null });
    }

    handleSubmit = event => {
        event.preventDefault();
        Axios.post('/api/v1/auth/create', {
            employee: {
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            }
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ modalErr: result.data.err.message });
                    return;
                }

                this.handleRefresh();
                this.clear();
            })
            .catch(err => this.setState({ err }));
    }

    clear = () => {
        this.setState({ name: '', email: '', password: '' });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h5 className="red-text">{this.state.err ? this.state.err.message : null}</h5>
                </div>
                <div className="fixed-action-btn">
                    <a href="/" className="btn-floating blue" onClick={this.showModal}><i className="material-icons">add</i></a>
                </div>
                <div className="row">
                    {this.state.employees ? this.state.employees.map((emp, index) => {
                        return (
                            <div key={index} className="col s12 m4 l3">
                                <div className="card">
                                    <div className="card-content">
                                        <span className="card-title">{emp.name}</span>
                                        <p>{emp.email}</p>
                                    </div>
                                    <div className="card-action">
                                        {emp.isAdmin ?
                                            <button className="btn-flat red-text waves-effect waves-light" onClick={() => this.toggleAdmin(emp)}>Revoke Admin</button>
                                            :
                                            <button className="btn-flat green-text waves-effect waves-light" onClick={() => this.toggleAdmin(emp)}>Grant Admin</button>
                                        }
                                        <button className="btn-flat red-text waves-effect waves-light" onClick={() => this.handleDelete(emp.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
                <div id="modal" className="modal">
                    <div className="container">
                        <div className="row">
                            <div style={{ height: '12px' }} />
                        </div>
                        <div className="row">
                            <h5 className="red-text">{this.state.modalErr ? this.state.modalErr : null}</h5>
                        </div>
                        <div className="row">
                            <h4>Create New Employee</h4>
                        </div>
                        <div className="row">
                            <form>
                                <div className="row">
                                    <div className="input-field">
                                        <input name="name" id="name" type="text" onChange={this.handleTextChange} value={this.state.name} />
                                        <label htmlFor="name">Name</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <input name="email" id="email" type="text" onChange={this.handleTextChange} value={this.state.email} />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <input type="text" id="password" name="password" onChange={this.handleTextChange} value={this.state.password} />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <button className="btn blue waves-effect waves-light" onClick={this.handleSubmit}>Create</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}