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
      modalShow: false,
      showReviewModal: false,
      partialQty: null,
      err: ''
    }
    Axios.get('/api/v1/stations/all')
      .then(result => {
        if (result.data.err) {
          this.setState({ err: result.data.err })
          return;
        }

        this.setState({ stations: result.data })
      })
      .catch(err => this.setState({ err }))
  }

  handleStationSelect = (event) => {
    Axios.get(`/api/v1/workorders/active/${event.target.getAttribute('data-id')}`)
      .then(result => {
        if (result.data.err) {
          this.setState({ err: result.data.err })
          return;
        }

        const arr = [];
        result.data.forEach(workOrder => arr.push({ ...workOrder, inProgress: false }));
        this.setState({ workOrders: arr });
      })
      .catch(err => this.setState({ err }))
  }

  handleLogout = () => {
    Axios.post('/api/v1/auth/logout')
      .then(result => {
        if (result.data.err) {
          this.setState({ err: result.data.err })
          return;
        }

        if (result.data.signedOut === true) {
          sessionStorage.clear();
          window.location.replace('/');
        }
      })
      .catch(err => this.setState({ err }))
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
    alert('Here we go!')
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
        if (result.data.err) {
          this.setState({ err: result.data.err })
          return;
        }

        Axios.get(`/api/v1/workorders/active/${this.state.currentWorkOrder.currentStation.id}`)
          .then(result => {
            if (result.data.err) {
              this.setState({ err: result.data.err })
              return;
            }

            this.setState({ workOrders: result.data, modalShow: false, clock: 0, showReviewModal: false })
          })
          .catch(err => this.setState({ err }))
      })
      .catch(err => this.setState({ err }))
  }

  handleJobStop = (event) => {
    clearInterval(this.state.clockInterval);
    this.setState({modalShow: false, showReviewModal: true});
  }

  componentWillMount() {
    Axios.post('/api/v1/auth/verify', {
      token: sessionStorage.getItem('token')
    })
      .then(result => {
        if (result.data.err) {
          this.setState({ err: result.data.err })
          return;
        }

        if (result.data.uid === sessionStorage.getItem('uid')) {
          this.setState({ isLoggedIn: true })
        }
        else {
          sessionStorage.clear();
        }
      })
      .catch(err => this.setState({ err }))
  }

  viewAttachment = event => {
    firebase.storage().ref(event.target.getAttribute('data-filepath')).getDownloadURL()
      .then(url => window.open(url, '_blank'));
  }

  handleInput = event =>{
    const name = event.target.name;
    const value = parseInt(event.target.value);
    this.setState({[name]: value});
  }

  handlePartialCompletion = () => {
    if(this.state.partialQty < 0 || this.state.partialQty > (parseInt(this.state.currentWorkOrder.quantity) - parseInt(this.state.currentWorkOrder.partialQty))){
      alert(`Please choose a quantity between 0 and ${this.state.currentWorkOrder.quantity - this.state.currentWorkOrder.partialQty}`);
      return;
    }

    if(this.state.partialQty === (parseInt(this.state.currentWorkOrder.quantity) - parseInt(this.state.partialQty))){
      this.handleJobFinish();
      return;
    }

      const currentStation = {};
      Object.assign(currentStation, this.state.currentWorkOrder.currentStation);
      currentStation.time = this.state.clock;
      Axios.put(`/api/v1/workorders/update/${this.state.currentWorkOrder.id}`, {
        currentStation,
        uid: sessionStorage.getItem('uid'),
        username: sessionStorage.getItem('username'),
        partsCompleted: this.state.partialQty,
        partialQty: parseInt(this.state.currentWorkOrder.partialQty) + parseInt(this.state.partialQty)
      })
        .then(result => {
          if (result.data.err) {
            this.setState({ err: result.data.err })
            return;
          }
  
          Axios.get(`/api/v1/workorders/active/${currentStation.id}`)
            .then(result => {
              if (result.data.err) {
                this.setState({ err: result.data.err })
                return;
              }
  
              this.setState({ workOrders: result.data, modalShow: false, showReviewModal: false })
            })
            .catch(err => this.setState({ err }))
        })
        .catch(err => this.setState({ err }))
  
  }

  handleSplit = () => {

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
          <div className="row">
            <h2 style={{ color: 'red' }}>{this.state.err}</h2>
          </div>
          <div className="row">
            {this.state.workOrders.map(workOrder => <WorkOrder key={workOrder.id} id={workOrder.id} handleJobStart={this.handleJobStart} text={workOrder.notes} title={workOrder.part.name} quantity={workOrder.quantity} qtyRemaining={(parseInt(workOrder.quantity)) - workOrder.partialQty} assemblyName={workOrder.assemblyName} />)}
          </div>
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


        <Modal show={this.state.showReviewModal} >
          <Modal.Header>
            <Modal.Title>Work Review</Modal.Title>
            <h3>Total Parts: {this.state.currentWorkOrder.quantity}</h3>
              <div className="input-group">
                <span className="input-group-addon" id="parts-completed-addon">Parts Completed</span>
                <input className="form-control" type="number" id="parts-completed" aria-describedby="parts-completed-addon" name="partialQty" onChange={this.handleInput}></input>
              </div>
            <Modal.Footer>
              <button className="btn btn-primary" onClick={this.handlePartialCompletion}>Done</button>
              <button className="btn btn-danger" onClick={this.handleSplit}>Split</button>
            </Modal.Footer>
          </Modal.Header>
        </Modal>

      </div>
    );
  }
}

export default Employee;
