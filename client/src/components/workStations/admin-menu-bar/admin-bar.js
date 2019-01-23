import React from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import PartPage from '../../partsPage';
import Axios from 'axios';
import AdminEmployeePage from '../../adminEmployeePage';
import StationsPage from '../../stationsPage';
import JobPage from '../../jobsPage';
import Overview from '../../Overview';

class AdminBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ref: null,
            username: null,
            err: ''
        }
    }

    handleClick = event => {
        event.preventDefault();
        const ref = event.target.getAttribute('data-ref');
        document.getElementById(ref).click();
    }

    handleLogout = () => {
        Axios.post('/api/v1/auth/logout')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                if (result.data.signedOut === true) {
                    sessionStorage.clear();
                    window.location.replace('/');
                }
            })
            .catch(err => this.setState({ err }))
    }

    render = props => {
        return (
            <Router>
                <div>
                    <Navbar inverse collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="/" data-ref="admin" onClick={this.handleClick}>{sessionStorage.getItem('username')}</a>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem eventKey={1} data-ref="stations" title="Work Stations" onClick={this.handleClick} >
                                    Work Stations
                </NavItem>
                            </Nav>
                            <Nav>
                                <NavItem eventKey={2} data-ref="jobs" title="Jobs" onClick={this.handleClick} >
                                    Jobs
                </NavItem>
                            </Nav>
                            <Nav>
                                <NavItem eventKey={3} title="parts" data-ref="parts" onClick={this.handleClick} >
                                    Parts
                </NavItem>
                            </Nav>
                            <Nav>
                                <NavItem eventKey={4} data-ref="employees" title="Employees" onClick={this.handleClick} >
                                    Employees
                </NavItem>
                            </Nav>
                            <Nav pullRight>

                                <NavItem eventKey={2} data-ref="logout" onClick={this.handleLogout}>
                                    Logout
                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className="container">
                        <div className="row">
                            <h2 style={{ color: 'red' }}>{this.state.err}</h2>
                        </div>
                    </div>
                    <Link to="/admin/parts/view" id="parts" />
                    <Link to="/admin/stations" id="stations" />
                    <Link to="/admin/jobs/view" id="jobs" />
                    <Link to="/admin/employees/view" id="employees" />
                    <Link to="/admin" id="admin" />
                    <Link to="/" id="logout" />
                    <Route path="/admin/stations" component={StationsPage} />
                    <Route path="/admin/parts" component={PartPage} />
                    <Route path="/admin/employees" component={AdminEmployeePage} />
                    <Route path="/admin/jobs" component={JobPage} />
                    <Route exact path="/admin" component={Overview} />
                </div>
            </Router>
        );
    }
}
export default AdminBar;