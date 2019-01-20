import React from "react";
import MenuBar from "./workStations/menu-bar/index";
import Axios from 'axios';
import WorkOrder from './WorkOrder';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./employee.css";
const firebase = require('firebase/app');
require('firebase/storage');

function displayTime(time) {
  let hours = 0, minutes = 0, seconds = 0;

  hours = Math.floor(time / 60 / 60);
  if (hours < 10)
    hours = `0${hours}`;

  minutes = time >= 3600 ? Math.floor((time % 3600) / 60) : Math.floor(time / 60);
  if (minutes < 10)
    minutes = `0${minutes}`;

  seconds = time % 60;
  if (seconds < 10)
    seconds = `0${seconds}`

  return `${hours}:${minutes}:${seconds}`;
}


class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      workOrders: [],
      isLoggedIn: false,
      clockInterval: 0,
      clock: 0,
      currentWorkOrder: {},
      modalShow: false
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
    const id = event.target.getAttribute('data-id');
    const arr = this.state.workOrders.slice(0);
    let currentWorkOrder = {};
    arr.forEach(workOrder => {
      if (workOrder.id === id) {
        Object.assign(currentWorkOrder, workOrder);
      }
    })
    this.setState({ currentWorkOrder, clock: (currentWorkOrder.currentStation.time ? currentWorkOrder.currentStation.time : 0), modalShow: true }, () => {
      const clockInterval = setInterval(() => {
        this.setState(prevState => {
          return { clock: prevState.clock + 1 }
        })
      }, 1000);
      this.setState({ clockInterval });
    })
  }

  handleJobFinish = event => {
    clearInterval(this.state.clockInterval);

    const currentWorkOrder = {}
    Object.assign(currentWorkOrder, this.state.currentWorkOrder);
    currentWorkOrder.currentStation.time = this.state.clock;

    Axios.put(`api/v1/workorders/next`, {
      currentWorkOrder,
      uid: sessionStorage.getItem('uid'),
      username: sessionStorage.getItem('username')
    })
    .then(result => {
      console.log(result.data);
      Axios.get(`/api/v1/workorders/active/${this.state.currentWorkOrder.currentStation.id}`)
        .then(result => {
          this.setState({workOrders: result.data, modalShow: false, clock: 0})
        })
    })
  }

  handleJobStop = (event) => {
    clearInterval(this.state.clockInterval);
    const currentStation = {};
    Object.assign(currentStation, this.state.currentWorkOrder.currentStation);
    currentStation.time = this.state.clock;
    Axios.put(`/api/v1/workorders/update/${this.state.currentWorkOrder.id}`, {
      currentStation,
      uid: sessionStorage.getItem('uid'),
      username: sessionStorage.getItem('username')
    })
    .then(() => {
        Axios.get(`/api/v1/workorders/active/${currentStation.id}`)
          .then(result => {
            this.setState({workOrders: result.data, modalShow: false})
          })
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

  viewAttachment = event => {
    firebase.storage().ref(event.target.getAttribute('data-filepath')).getDownloadURL()
      .then(url => window.open(url, '_blank'));
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
      <div className='b'>
        <MenuBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} handleLogout={this.handleLogout} />


        <div className="container">
          {this.state.workOrders.map(workOrder => <WorkOrder key={workOrder.id} id={workOrder.id} handleJobStart={this.handleJobStart} text={workOrder.notes} title={workOrder.part.name} quantity={workOrder.quantity} />)}
        </div>


        <Modal show={this.state.modalShow} >
          <Modal.Header >
            <Modal.Title>Part: {this.state.currentWorkOrder.id ? this.state.currentWorkOrder.part.name : ''}</Modal.Title>
            <h3>{displayTime(this.state.clock)}</h3>
          </Modal.Header>
          <Modal.Body>
            <h4>Quantity: {this.state.currentWorkOrder.id ? this.state.currentWorkOrder.quantity : ''}</h4>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" data-filepath={this.state.currentWorkOrder.id ? `${this.state.currentWorkOrder.part.id}/${this.state.currentWorkOrder.part.filename}` : ''} onClick={this.viewAttachment}>View Attachment</button>
            <button className="btn btn-danger" onClick={this.handleJobStop}>Stop</button>
            <button className="btn btn-success" onClick={this.handleJobFinish}>Finish Job</button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default Employee;
