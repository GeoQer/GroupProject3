import React from 'react';
import Axios from 'axios';
import { Route, Link } from 'react-router-dom';
import M from 'materialize-css';
import Overview from './Overview';
import Stations from './Stations';
import Parts from './Parts';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            err: null
        }
    }

    componentWillMount = () => {
        if (!this.state.isLoadedData) {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if (!userInfo) {
                return;
            }
            Axios.post('/api/v1/auth/verify', {
                token: userInfo.token
            })
                .then(result => {
                    if (result.data.err) {
                        this.setState({ err: result.data.err, isLoadedData: true });
                        return;
                    }

                    this.setState({ isLoggedIn: true, isAdmin: userInfo.isAdmin, username: userInfo.name })
                })
                .catch(err => this.setState({ err, isLoggedIn: true }))
        }
    }

    componentDidUpdate = () => {
        let elem = document.querySelector('#slide-out');
        M.Sidenav.init(elem, { draggable: true });
    }

    render() {
        if (!this.state.isLoggedIn)
            return <p>Loading</p>

        if (this.state.err)
            return <h4>Login Failed</h4>

        if (!this.state.isAdmin)
            this.props.history.replace('/employee');

        return (
            <div>
                <nav>
                    <div className="nav-wrapper black">
                        <Link to="/admin" className="brand-logo">{this.state.username}</Link>
                        <a href="/" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                        <ul id="navbar" className="right hide-on-med-and-down">
                            <li><Link to="/admin">Overview</Link></li>
                            <li><Link to="/admin/workstations">Work Stations</Link></li>
                            <li><Link to="/admin/parts">Parts</Link></li>
                            <li><Link to="/admin/assemblies">Assemblies</Link></li>
                            <li><Link to="/admin/workorders">Work Orders</Link></li>
                            <li><Link to="/admin/employees">Employees</Link></li>
                        </ul>
                    </div>
                </nav>

                <ul id="slide-out" className="sidenav">
                    <li><h5>{this.state.username}</h5></li>
                    <li><div className="divider" /></li>
                    <li><Link to="/admin">Overview</Link></li>
                    <li><Link to="/admin/workstations">Work Stations</Link></li>
                    <li><Link to="/admin/parts">Parts</Link></li>
                    <li><Link to="/admin/assemblies">Assemblies</Link></li>
                    <li><Link to="/admin/workorders">Work Orders</Link></li>
                    <li><Link to="/admin/employees">Employees</Link></li>
                </ul>

                <Route exact path='/admin' component={Overview} />
                <Route exact path="/admin/workstations" component={Stations} />
                <Route exact path="/admin/parts" component={Parts} />
            </div>
        )
    }
}