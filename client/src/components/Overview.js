import React from 'react';
import Axios from 'axios';
import { Modal } from 'react-bootstrap';

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

let sum = 0;

class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            workOrders: [],
            currentWorkOrder: null,
            showModal: false,
            activeSations: false,
            err: ''
        }

        Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }
                this.setState({ stations: result.data }, () => {
                    Axios.get('/api/v1/workorders/active')
                        .then(result => {
                            if (result.data.err) {
                                this.setState({ err: result.data.err });
                                return;
                            }

                            this.setState({ workOrders: result.data }, () => {

                                const stations = this.state.stations.slice(0);
                                const indices = [];

                                stations.forEach((station, index) => {
                                    let count = 0;
                                    this.state.workOrders.forEach(workOrder => {
                                        if (workOrder.currentStation.id === station.id)
                                            count++;
                                    })
                                    if (count === 0) {
                                        indices.push(index)
                                    }
                                })

                                indices.forEach(index => {
                                    stations[index] = null;
                                })

                                const newStations = [];

                                stations.forEach(station => {
                                    if (station != null)
                                        newStations.push(station);
                                })
                                this.setState({ activeStations: newStations });
                            })
                        })
                        .catch(err => this.setState({ err }))
                })
            })
            .catch(err => this.setState({ err }))
    }

    viewHistory = event => {
        const id = event.target.getAttribute('data-id');
        sum = 0;
        this.state.workOrders.forEach(workOrder => {
            if (workOrder.id === id)
                this.setState({ currentWorkOrder: workOrder, showModal: true }, () => console.log(this.state.currentWorkOrder.history))
        })
    }

    handleClose = () => this.setState({ showModal: false });

    render(props) {
        if (!this.state.activeStations)
            return 'Loading...'

        return (
            <div className="container" >
                <div className="row">
                    <h2 style={{ color: 'red' }}>{this.state.err}</h2>
                </div>
                {this.state.activeStations.map((station, index) => {
                    return (
                        <div key={index} className="row">
                            <h2>{station.name}</h2>
                            <table className="table">
                                <thead>
                                    <tr><th>Job ID</th>
                                        <th>Assembly ID</th>
                                        <th>Part Name</th>
                                        <th>Quantity</th></tr>
                                </thead>
                                <tbody>
                                    {this.state.workOrders.map((workOrder, index) => {
                                        if (workOrder.currentStation.id === station.id)
                                            return (
                                                <tr key={index}>
                                                    <td>{workOrder.id.slice(workOrder.id.length - 4, workOrder.id.length)}</td>
                                                    <td>{workOrder.isAssembly ? workOrder.assemblyID.slice(workOrder.assemblyID.length - 4, workOrder.assemblyID.length) : ''}</td>
                                                    <td>{workOrder.part.name}</td>
                                                    <td>{workOrder.quantity}</td>
                                                    <td><button className="btn btn-primary" data-id={workOrder.id} onClick={this.viewHistory}>View History</button></td>
                                                </tr>
                                            )
                                        else
                                            return null;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                })
                }
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Job History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.currentWorkOrder ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Station</th>
                                        <th>Employee Name</th>
                                        <th>Time</th>
                                        <th>Total Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.currentWorkOrder.history.map((historyItem, index) => {
                                        sum += historyItem.time;
                                        return (
                                            <tr key={index}>
                                                <td>{historyItem.stationName}</td>
                                                <td>{historyItem.employeeName}</td>
                                                <td>{displayTime(historyItem.time)}</td>
                                                <td>{displayTime(sum)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : ''}
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}


export default Overview;