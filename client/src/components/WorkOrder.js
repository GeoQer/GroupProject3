import React from 'react';
import "./WorkOrder.css";

const WorkOrder = (props) => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail card" >
            <div className="caption">
                <h2 className="card-title">{props.title}</h2>
                {props.assemblyName ? <h4>Assembly: {props.assemblyName}</h4> : '' }
                <h4>Quantity: {props.quantity}</h4>
                <p className="card-text"><strong>Notes: </strong>{props.text}</p>
                <button value={props.id} type="button" className="btn btn-success" onClick={props.handleJobStart} data-id={props.id}>Start</button>
            </div>
        </div>
    </div>
);

export default WorkOrder;