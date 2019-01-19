import React from 'react';

const Overview = props => (
    <div className="container">
        {props.stations.map((station, index) => {
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
                            {props.workOrders.map((workOrder, index) => {
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
        })}
    </div>
)

export default Overview;