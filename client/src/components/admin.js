import React from "react";
import AdminBar from "./workStations/admin-menu-bar/index";
import Axios from 'axios';
import { Link } from 'react-router-dom';
import "./admin.css";
const firebase = require('firebase/app');
require('firebase/auth');
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      stations: [],
      workOrders: []
    }
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
    if (!(sessionStorage.getItem('isAdmin') === "true")) {
      return (
        <div className='c'>
          <div className="container">
            <h1>You are not an Admin</h1>
            <Link to="/employee">Go to Employee Page</Link>
          </div>
        </div>
      )
    }
    else if (!this.state.isLoggedIn) {
      return (
        <div className='d'>
          <div className="container">
            <h1>You are not logged in</h1>
            <Link to="/">login</Link>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <AdminBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} />
        </div>
      );
    }
  }
}

export default Admin;