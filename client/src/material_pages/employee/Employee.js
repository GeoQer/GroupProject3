import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

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

export default class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            stations: null,
            selectedStation: null,
            workOrders: null,
            sortedWorkOrders: null,
            selectedWorkOrder: null,
            err: null,
            modalErr: null,
            counter: 0,
            timer: null,
            userInfo: null
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
        const modals = document.querySelectorAll('.modal');
        M.Sidenav.init(sidenav);
        M.Modal.init(modals);
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
        this.hideModal();
        this.toggleModal();
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

    toggleModal = () => {
        this.hideModal();
        const inputModal = document.getElementById('inputModal');
        const instance = M.Modal.getInstance(inputModal);
        instance.open();
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper grey darken-3">
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
                        <div className="container">
                            <div className="row">
                                <h5 className="red-text">{this.state.modalErr ? this.state.modalErr : null}</h5>
                            </div>
                            <div className="row">
                                <h5>{this.state.selectedWorkOrder ? this.state.selectedWorkOrder.part.name : null}</h5>
                            </div>
                            <div className="row">
                                <h6>{displayTime(this.state.counter)}</h6>
                            </div>
                            <div className="row">
                                <hr />
                                <button className="btn-flat red-text" onClick={this.handleStop}>Stop</button>
                            </div>
                        </div>
                    </div>
                    <div id="inputModal" className="modal">
                        <div className="container">
                            <div className="row">
                                <h5>Work Review</h5>
                            </div>
                            <div className="row">
                                <div className="input-field">
                                    <input type="text"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}