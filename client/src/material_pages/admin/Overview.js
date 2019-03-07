import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';
let sum = 0;

function formatTime(time) {
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


const Table = props => (
    <table>
        <thead>
            <tr>
                <th>Part Name</th>
                <th>Order Qty</th>
                <th>Remaining Qty</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.workorders.map((wo, index) => {
                return (
                    <tr key={index}>
                        <td>{wo.part.name}</td>
                        <td>{wo.quantity}</td>
                        <td>{wo.quantity - wo.partialQty}</td>
                        <td><button className="btn-flat blue-text white waves-effect waves-light blue" onClick={() => props.handleHistory(wo)}>History</button></td>
                    </tr>
                )
            })}
        </tbody>
    </table>
)



export default class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workOrders: null,
            stations: null,
            sortedOrders: null,
            currentHistory: null,
            err: null
        }
    }

    componentDidMount = () => {
        this.handleRefresh();
        const modal = document.getElementById('modal');
        M.Modal.init(modal);

    }

    sortWorkOrders = (stations, workorders) => {
        if (!stations || !workorders) {
            this.setState({ err: { message: 'Station and Work Order data could not be accessed.' } });
            return;
        }
        const sorted = [];

        stations.forEach(station => {
            let obj = {
                name: station.name,
                workorders: []
            };
            let hasOrder = false;
            workorders.forEach(wo => {
                if (wo.currentStation.id === station.id) {
                    hasOrder = true;
                    obj.workorders.push(wo);
                }
            })
            if (hasOrder)
                sorted.push(obj);
        })

        this.setState({ sortedOrders: sorted });
    }

    handleRefresh = async () => {
        let stations, workorders;
        await Axios.get('/api/v1/workorders/active')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                workorders = result.data;
            })
            .catch(err => this.setState({ err }));

        await Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                stations = result.data;
            })
            .catch(err => this.setState({ err }));

        this.sortWorkOrders(stations, workorders);
    }

    handleHistory = async wo => {
        sum = 0;
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        await this.setState({ currentHistory: wo.history });
        instance.open();
    }

    render() {
        return (
            <div className="container">
                {this.state.sortedOrders ? this.state.sortedOrders.map((data, index) => {
                    return (
                        <div key={index} className="row">
                            <h3>{data.name}</h3>
                            <Table workorders={data.workorders} handleHistory={this.handleHistory} />
                            <div style={{ height: '60px' }} />
                        </div>
                    )
                }) : null}

                <div id="modal" className="modal">
                    <div className="container">
                        <div className="row">
                            <div style={{height: '12px'}} />
                        </div>
                        <div className="row">
                            <h5>Part History</h5>
                        </div>
                        <div className="row">
                        <table>
                            <thead>
                                <tr>
                                    <th>Station</th>
                                    <th>Employee</th>
                                    <th>Elapsed Time</th>
                                    <th>Parts Completed</th>
                                    <th>Total Elapsed Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.currentHistory ? this.state.currentHistory.map((data, index) => {
                                    sum += data.time;
                                    return (
                                        <tr key={index}>
                                            <td>{data.stationName}</td>
                                            <td>{data.employeeName}</td>
                                            <td>{formatTime(data.time)}</td>
                                            <td>{data.partsCompleted}</td>
                                            <td>{formatTime(sum)}</td>
                                        </tr>
                                    )
                                }) : null}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}