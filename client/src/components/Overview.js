import React from 'react';
import Axios from 'axios';

class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            workOrders: [],
            activeSations: false
        }

        Axios.get('/api/v1/stations/all')
            .then(result => this.setState({ stations: result.data }, () => {
                Axios.get('/api/v1/workorders/active')
                    .then(result => this.setState({ workOrders: result.data }, () => {

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
                    }))
            }))
    }

    render(props) {
        if (!this.state.activeStations)
            return 'Loading...'

        return (
            <div className="container" >
                {this.state.activeStations.map((station, index) => {
                    return (
                        <div key={index} className="row">
                            <h2>{station.name}</h2>
                            <table className="table">
                                <thead>
                                    <tr><th>Job ID</th>
                                        <th>Part Name</th>
                                        <th>Quantity</th></tr>
                                </thead>
                                <tbody>
                                    {this.state.workOrders.map((workOrder, index) => {
                                        if (workOrder.currentStation.id === station.id)
                                            return (
                                                <tr key={index}>
                                                    <td>{workOrder.id.slice(workOrder.id.length - 4, workOrder.id.length)}</td>
                                                    <td>{workOrder.part.name}</td>
                                                    <td>{workOrder.quantity}</td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                })
                }
            </div>
        )
    }
}


export default Overview;