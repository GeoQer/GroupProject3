import React from "react";

const TubeBlender = () => (
    <div className="container">
        <div className="row">
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Job #</h5>
                        <p className="card-text">Job text here.</p>
                        <button type="button" className="btn btn-success">Start Job</button>
                        <button type="button" className="btn btn-danger">Finish Job</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
        
export default TubeBlender;