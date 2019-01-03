import React from 'react';

const Card = (props) => (
    <div className="col-sm-6">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text">{props.text}</p>
                <button type="button" className="btn btn-success" onClick={props.onStart}>Start</button>
                <button type="button" className="btn btn-danger" onClick={props.onFinish}>Finish</button>
            </div>
        </div>
    </div>
);

export default Card;