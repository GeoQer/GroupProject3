import React from "react";
import MenuBar from "./workStations/menu-bar/index";
import Axios from 'axios';
import WorkOrder from './WorkOrder';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./employee.css";
const firebase = require('firebase/app');
require('firebase/storage');
require('firebase/firestore');

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
      clock: 7198,
      modalProps: {
        show: false,
        title: 'MODAL TITLE',
        quantity: 100,
        filepath: 'undefined/Screenshot (29).png',
      }
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
    const modalProps = Object.assign(this.state.modalProps);
    modalProps.show = true;
    const clockInterval = setInterval(() => {
      this.setState(prevState => {
        return { clock: prevState.clock + 1 }
      })
    }, 1000);
    this.setState({ modalProps, clockInterval });
  }

  handleJobStop = (event) => {
    const modalProps = Object.assign(this.state.modalProps);
    modalProps.show = false;
    clearInterval(this.state.clockInterval);
    this.setState({ modalProps });
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
          {console.log(this.state.workOrders)}
          {this.state.workOrders.map(workOrder => <WorkOrder key={workOrder.id} id={workOrder.id} handleJobStart={this.handleJobStart} text={workOrder.notes} title={workOrder.part.name} quantity={workOrder.quantity} />)}
        </div>
        <Modal show={this.state.modalProps.show} >
          <Modal.Header >
            <Modal.Title>Part: {this.state.modalProps.title}</Modal.Title>
            <h3>{displayTime(this.state.clock)}</h3>
          </Modal.Header>
          <Modal.Body>
            <h4>Quantity: {this.state.modalProps.quantity}</h4>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" data-filepath={this.state.modalProps.filepath} onClick={this.viewAttachment}>View Attachment</button>
            <button className="btn btn-danger" onClick={this.handleJobStop}>Stop</button>
            <button className="btn btn-success">Finish Job</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Employee;
