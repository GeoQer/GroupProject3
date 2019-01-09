import React from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

const AdminBar = props => (
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#brand">Admin Name</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem eventKey={1} title="Work Stations">
                    Work Stations
                </NavItem>
            </Nav>
            <Nav>
                <NavItem eventKey={2} title="Jobs">
                    Jobs
                </NavItem>
            </Nav>
            <Nav>
                <NavItem eventKey={3} title="Parts">
                    Parts
                </NavItem>
            </Nav>
            <Nav>
                <NavItem eventKey={4} title="Employees">
                    Employees
                </NavItem>
            </Nav>
            <Nav pullRight>
                
                <NavItem eventKey={2} href="#logout">
                    Logout
                </NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default AdminBar;