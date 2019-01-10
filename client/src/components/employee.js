import React from "react";
import MenuBar from "./workStations/menu-bar/index";
import Axios from 'axios';
import WorkOrder from './WorkOrder';
import { Link } from 'react-router-dom';


class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      workOrders: []
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

  handleLogout = () => {
    Axios.post('/api/v1/auth/logout')
      .then(result => {
        if (result.data.signedOut === true) {
          sessionStorage.clear();
          window.location.replace('/');
        }
      });
  }

  handleJobStart = (event) => {
    const id = event.target.value;
    const arr = this.state.workOrders.slice(0);
    arr.forEach(workOrder => {
      if (workOrder.id === id) {
        workOrder.inProgress = true;
      }
      else {
        workOrder.inProgress = false;
      }
    })
    this.setState({ workOrders: arr });
  }

  handleJobStop = (event) => {
    const arr = this.state.workOrders.slice(0);
    arr.forEach(workOrder => {
      workOrder.inProgress = false;
    });
    this.setState({ workOrders: arr });
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
    if (!this.state.isLoggedIn) {
      return (
        <div>
          <h1>You are not logged in</h1>
          <Link to="/">login</Link>
        </div>
      )
    }

    return (
      <div>
        <MenuBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} handleLogout={this.handleLogout} />
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

export default Employee;
