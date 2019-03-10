import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/storage';

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

const WorkingModal = props => (
    <div className="container">
        <div className="row">
            <h5 className="left">{props.workOrder.part.name}</h5>
            <h3 className="right">{displayTime(props.time)}</h3>
        </div>
        <div className="row">
            <h5>Order Quantity: {props.workOrder.quantity}</h5>
            <h5>Remaining: {props.workOrder.quantity - props.workOrder.partialQty}</h5>
        </div>
        <div className="row">
            <h5 className="red-text">{props.modalErr}</h5>
        </div>
        <div className="row">
            <hr />
            <button className="btn-flat blue-text waves-effect waves-light" onClick={() => props.viewAttachment(`${props.workOrder.part.id}/${props.workOrder.part.filename}`)}>Attachment</button>
            <button className="btn-flat red-text waves-effect waves-light right" onClick={props.handleStop}>Stop</button>
            <button className="btn-flat green-text waves-effect waves-light right" onClick={props.handleFinish}>Finish</button>
        </div>
    </div>
)

const ReviewModal = props => (
    <div className="container">
        <div className="row">
            <h5 className="left">{props.workOrder.part.name}</h5>
            <h3 className="right">{displayTime(props.time)}</h3>
        </div>
        <div className="row">
            <h5>How many parts did you complete?</h5>
            <div className="input-field">
                <input type="text" name="partsCompleted" onChange={props.handleTextChange} value={props.partsCompleted} />
                <label htmlFor="partsCompleted">Parts completed</label>
            </div>
            <div className="row">
                <h6 className="red-text left">{props.modalErr}</h6>
                <button className="btn-flat blue-text waves-effect waves-light right" onClick={props.handleReview}>Done</button>
            </div>
        </div>
    </div>
)


export default class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            stations: null,
            selectedStation: null,
            workOrders: null,
            sortedWorkOrders: null,
            selectedWorkOrder: {
                part: { name: 'work order not loaded' },
                quantity: 'work order not loaded',
                partialQty: 'work order not loaded'
            },
            err: null,
            modalErr: null,
            counter: 0,
            timer: null,
            userInfo: null,
            reviewing: false,
            partsCompleted: '',
        }
    }

    logout = () => {
        Axios.post('api/v1/auth/logout')
            .then(result => {
                sessionStorage.clear();
            })
    }

    sortWorkOrders = () => {
        if (!this.state.stations || !this.state.workOrders)
            return;

        const stationID = document.querySelector('select').value;

        this.state.stations.forEach(station => { if (station.id === stationID) this.setState({ selectedStation: station }); })

        const sortedWorkOrders = [];

        this.state.workOrders.forEach(wo => {
            if (wo.currentStation.id === stationID)
                sortedWorkOrders.push(wo);
        })
        this.setState({ sortedWorkOrders });
    }

    componentWillMount = () => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!userInfo) {
            this.props.history.replace('/');
            return;
        }
        this.setState({ isAdmin: userInfo.isAdmin, username: userInfo.name, userInfo });
    }

    componentDidMount = () => {
        this.handleRefresh();
        const sidenav = document.getElementById('slide-out');
        M.Sidenav.init(sidenav);
        const modal = document.getElementById('modal');
        M.Modal.init(modal, { dismissible: false });
    }

    componentDidUpdate = () => {
        const select = document.querySelector('select');
        M.FormSelect.init(select);
    }

    handleRefresh = async () => {
        await Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                this.setState({ stations: result.data })
            })

        await Axios.get('/api/v1/workorders/active')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ workOrders: result.data })
            })

        this.sortWorkOrders();
    }

    handleReview = () => {
        const partsCompleted = parseInt(this.state.partsCompleted);
        if (partsCompleted === null || isNaN(partsCompleted)) {
            this.setState({ modalErr: 'Parts Completed must be a number' });
            return;
        }
        else if (partsCompleted > (this.state.selectedWorkOrder.quantity - this.state.selectedWorkOrder.partialQty) || partsCompleted < 0) {
            this.setState({ modalErr: `Parts Completed must be between 0 and ${this.state.selectedWorkOrder.quantity - this.state.selectedWorkOrder.partialQty}` });
            return;
        }

        if (partsCompleted === (parseInt(this.state.selectedWorkOrder.quantity) - parseInt(this.state.selectedWorkOrder.partialQty))) {
            this.handleFinish();
            return;
        }

        const currentStation = Object.assign(this.state.selectedStation);
        currentStation.time = this.state.counter;

        Axios.put(`/api/v1/workorders/update/${this.state.selectedWorkOrder.id}`, {
            currentStation,
            uid: this.state.userInfo.uid,
            username: this.state.userInfo.name,
            partsCompleted,
            partialQty: parseInt(this.state.selectedWorkOrder.partialQty) + partsCompleted
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }
                this.handleRefresh();
                this.hideModal();
                this.setState({ reviewing: false, modalErr: null, partsCompleted: '' });
            })
    }

    handleFinish = () => {
        clearInterval(this.state.timer);
        const currentWorkOrder = Object.assign(this.state.selectedWorkOrder);
        currentWorkOrder.currentStation.time = this.state.counter;

        Axios.put(`api/v1/workorders/next`, {
            currentWorkOrder,
            uid: this.state.userInfo.uid,
            username: this.state.userInfo.name,
            partsCompleted: parseInt(this.state.partsCompleted)
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.handleRefresh();
                this.hideModal();
                this.setState({ reviewing: false, modalErr: null, partsCompleted: '' });
            })
    }

    handleStart = wo => {
        this.setState({ selectedWorkOrder: wo });
        this.showModal();

        const timer = setInterval(() => {
            this.setState(prevState => ({ counter: (prevState.counter + 1) }));
        }, 1000);

        this.setState({ timer });
    }

    handleStop = () => {
        clearInterval(this.state.timer);
        this.setState({ reviewing: true, modalErr: null });
    }

    handlePut = () => {
        Axios.put('/api/v1/workorders/next', {
            currentWorkOrder: this.state.selectedWorkOrder,
            uid: this.state.userInfo.uid,
            username: this.state.userInfo.name,
            partsCompleted: 0
        })
    }

    showModal = () => {
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    hideModal = () => {
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.close();
    }

    handleTextChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        let modalErr = null;

        if (!value || isNaN(value)) {
            modalErr = 'Parts Completed must be a number';
        }
        else if (value > (this.state.selectedWorkOrder.quantity - this.state.selectedWorkOrder.partialQty) || value < 0) {
            modalErr = `Parts Completed must be between 0 and ${this.state.selectedWorkOrder.quantity - this.state.selectedWorkOrder.partialQty}`;
        }

        this.setState({ [name]: value, modalErr });
    }

    viewAttachment = filepath => {
        firebase.storage().ref(filepath).getDownloadURL()
            .then(url => window.open(url, '_blank'));
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper teal darken-4">
                        <Link to="/employee" className="brand-logo">{this.state.username}</Link>
                        <a href="/" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                        <ul id="navbar" className="right hide-on-med-and-down">
                            {this.state.isAdmin ? <li><Link to="/admin">Go to Admin Page</Link></li> : null}
                            <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                        </ul>
                    </div>
                </nav>

                <ul id="slide-out" className="sidenav">
                    {this.state.isAdmin ? <li><Link to="/admin">Go to Admin Page</Link></li> : null}
                    <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                </ul>

                <div className="container">
                    <div className="row">
                        <div style={{ height: '22px' }} />
                    </div>
                    <div className="row">
                        <div className="input-field">
                            <select onChange={this.sortWorkOrders}>
                                {this.state.stations ? this.state.stations.map((station, index) => {
                                    return <option key={index} value={station.id}>{station.name}</option>
                                }) : <option disabled>Unable to Load Stations</option>}
                            </select>
                            <label>Select a Station</label>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.sortedWorkOrders ? this.state.sortedWorkOrders.map((wo, index) => {
                            return (
                                <div key={index} className="col s12 m4 l3">
                                    <div className="card">
                                        <div className="card-content">
                                            <h5>{wo.part.name}</h5>
                                            <p>Order quantity: {wo.quantity}</p>
                                            <p>Remaining quantity: {wo.quantity - wo.partialQty}</p>
                                            <p>Notes: {wo.notes}</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="/" className="green-text" onClick={e => { e.preventDefault(); this.handleStart(wo) }}>Start</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : null}
                    </div>
                    <div id="modal" className="modal">
                        {this.state.reviewing ?
                            <ReviewModal workOrder={this.state.selectedWorkOrder} time={this.state.counter} modalErr={this.state.modalErr} handleTextChange={this.handleTextChange} handleReview={this.handleReview} partsCompleted={this.state.partsCompleted} />
                            :
                            <WorkingModal workOrder={this.state.selectedWorkOrder} time={this.state.counter} modalErr={this.state.modalErr} handleStop={this.handleStop} viewAttachment={this.viewAttachment} handleFinish={this.handleFinish} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}