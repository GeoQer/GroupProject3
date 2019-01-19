import React from 'react';
import { Navbar, MenuItem, NavItem, NavDropdown, Nav } from 'react-bootstrap';

const menuBar = props => (
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#brand">{sessionStorage.getItem('username')}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavDropdown eventKey={1} title="Work Stations" id="basic-nav-dropdown">
                    {props.stations.map(station => {
                        return(
                            <MenuItem data-id={station.id} key={station.id} onClick={props.handleStationSelect}>{station.name}</MenuItem>
                        )
                    })}
                </NavDropdown>
            </Nav>
            <Nav pullRight>
                {/* <NavItem eventKey={1} href="#profile">
                    Profile
                </NavItem> */}
                <NavItem eventKey={2} href="#logout" onClick={props.handleLogout}>
                    Logout
                </NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default menuBar;