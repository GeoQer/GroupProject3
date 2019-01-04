import React from 'react';

const WorkOrder = (props) => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail">
            <div className="caption">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text">{props.text}</p>
                {props.inProgress ?
                    <button value={props.id} type="button" className="btn btn-danger" onClick={props.onToggle}>Stop</button> :
                    <button value={props.id} type="button" className="btn btn-success" onClick={props.onToggle}>Start</button>
                }
            </div>
        </div>
    </div>
);

export default WorkOrder;