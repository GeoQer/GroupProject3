import React from 'react';

const menuBar = props => (
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#brand">Workstations</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavDropdown eventKey={1} title="Work Stations" id="basic-nav-dropdown">
                    <MenuItem eventKey={1.1} href="#programming">Programming</MenuItem>
                    <MenuItem eventKey={1.2} href="#laser">Laser</MenuItem>
                    <MenuItem eventKey={1.3} href="#coldSaw">Cold Saw</MenuItem>
                    <MenuItem eventKey={1.4} href="#pressBrake">Press Brake</MenuItem>
                    <MenuItem eventKey={1.5} href="#tubeBlender">Tube Blender</MenuItem>
                    <MenuItem eventKey={1.6} href="#welding">Welding</MenuItem>
                    <MenuItem eventKey={1.7} href="#grinding">Grinding</MenuItem>
                </NavDropdown>
            </Nav>
            <Nav pullRight>
                <NavItem eventKey={1} href="#profile">
                    Profile
                </NavItem>
                <NavItem eventKey={2} href="#logout">
                    Logout
                </NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default menuBar;