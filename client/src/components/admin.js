import React from "react";
import AdminBar from "./workStations/admin-menu-bar/index";
import Axios from 'axios';
import WorkOrder from './WorkOrder';
import { Link } from 'react-router-dom';
const firebase = require('firebase/app');
require('firebase/auth');
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      workOrders: [],
      isLoggedIn: false,
    }

    Axios.get('/api/v1/stations/all')
      .then(result => this.setState({ stations: result.data }));
  }

  handleStationSelect = (event) => {
    Axios.get(`/api/v1/workorders/active/${event.target.getAttribute('data-id')}`)
      .then(result => {
        const arr = [];
        result.data.forEach(workOrder => arr.push({ ...workOrder, inProgress: false }));
        this.setState({ workOrders: arr });
      });
  }

  componentWillMount() {
    Axios.post('/api/v1/auth/verify', {
      token: sessionStorage.getItem('token')
    })
      .then(result => {
        if (result.data.uid === sessionStorage.getItem('uid')) {
          this.setState({ isLoggedIn: true })
        }
        else {
          sessionStorage.clear();
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    console.log(this.state);
    if (!(sessionStorage.getItem('isAdmin') === "true")) {
      return (
        <div className="container">
          <h1>You are not an Admin</h1>
          <Link to="/employee">Go to Employee Page</Link>
        </div>
      )
    }
    else if (!this.state.isLoggedIn) {
      return (
        <div className="container">
          <h1>You are not logged in</h1>
          <Link to="/">login</Link>
        </div>
      )
    }
    else {
      return (
        <div>
          <AdminBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} />
          <div className="container">
            {this.state.workOrders.map(workOrder => {
              if (workOrder.inProgress) {
                return <WorkOrder key={workOrder.id} id={workOrder.id} onToggle={this.handleJobStop} inProgress={workOrder.inProgress} text={workOrder.text} title="this is a work order" />
              }
              else {
                return <WorkOrder key={workOrder.id} id={workOrder.id} onToggle={this.handleJobStart} inProgress={workOrder.inProgress} text={workOrder.text} title="this is a work order" />
              }
            })}
          </div>
        </div>
      );
    }
  }
}

export default Admin;