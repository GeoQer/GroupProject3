import React from 'react';
import JobForm from './jobForm';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';
const firebase = require('firebase/app');
require('firebase/storage');
require('firebase/firestore');
// var config = {
//     apiKey: "AIzaSyAZB-qbjpKVRvaQt17kPsPTMav3O12by6k",
//     authDomain: "project-runner-f1bdc.firebaseapp.com",
//     databaseURL: "https://project-runner-f1bdc.firebaseio.com",
//     projectId: "project-runner-f1bdc",
//     storageBucket: "project-runner-f1bdc.appspot.com",
//     messagingSenderId: "757776283780"
// };
// firebase.initializeApp(config);

const ViewJobs = props => (
    <div className="row">
        {props.jobs.map(job => <JobCard key={job.id} title={job.id.slice(job.id.length - 4, job.id.length)} parts={job.parts} filepath={job.filepath} viewAttachment={props.viewAttachment} />)}
    </div>
)

const JobCard = props => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail" >
            <div className="caption">
                <h3 className="card-title">{props.title}</h3>
                <p><strong>Parts: </strong></p>
                {/* {props.parts.map(part => <p key={part.id}>{part.name}</p>)} */}
                <button className="btn btn-primary" data-filepath={props.filepath} onClick={props.viewAttachment}>View Attachment</button>
            </div>
        </div>
    </div>
);

class JobPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            parts: [],
            interval: 0
        }

    }

    componentDidMount = () => {
        Axios.get('/api/v1/workorders/all')
            .then(result => this.setState({jobs: result.data}));
    
        let x = setInterval(() => {
            Axios.get('/api/v1/workorders/all')
            .then(result => this.setState({jobs: result.data}));
        }, 15000);
        this.setState({interval: x});    
    }

    componentWillUnmount = () => {
        clearInterval(this.state.interval);
    }

    handleTabSelect = (event) => {
        const target = event.target;
        const tabs = document.getElementsByClassName('tab-link');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].setAttribute('class', 'tab-link');
        }
        target.parentElement.setAttribute('class', 'active tab-link');
    }

    viewAttachment = event => {
        firebase.storage().ref(event.target.getAttribute('data-filepath')).getDownloadURL()
            .then(url => window.open(url, '_blank'));
    }

    render = props => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/jobs/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/jobs/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/jobs/create" component={JobForm} />
            <Route path="/admin/jobs/view" component={() => <ViewJobs jobs={this.state.jobs} viewAttachment={this.viewAttachment} />} />
        </div>
    )
}
export default JobPage;