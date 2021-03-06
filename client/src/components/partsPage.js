import React from 'react';
import PartForm from './partForm';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';
const firebase = require('firebase/app');
require('firebase/storage');
require('firebase/firestore');
var config = {
    apiKey: "AIzaSyAZB-qbjpKVRvaQt17kPsPTMav3O12by6k",
    authDomain: "project-runner-f1bdc.firebaseapp.com",
    databaseURL: "https://project-runner-f1bdc.firebaseio.com",
    projectId: "project-runner-f1bdc",
    storageBucket: "project-runner-f1bdc.appspot.com",
    messagingSenderId: "757776283780"
};
firebase.initializeApp(config);

const ViewParts = props => (
    <div className="row">
        {props.parts.map((part, index) => <PartCard key={index} title={part.name} stations={part.stations} filepath={part.filepath} viewAttachment={props.viewAttachment} handleEdit={props.handleEdit} id={part.id} handleDelete={props.handleDelete} />)}
    </div>
)

const PartCard = props => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail" >
            <div className="caption">
                <h3 className="card-title">{props.title}</h3>
                <p><strong>Stations: </strong></p>
                {props.stations.map((station, index) => <p key={`${station.id}${index}`}>{station.name}</p>)}
                <button className="btn btn-primary" data-filepath={props.filepath} onClick={props.viewAttachment}>View Attachment</button>
                <button style={{ marginLeft: "10px" }} className="btn btn-warning" data-id={props.id} onClick={props.handleEdit}>Edit</button>
                <button style={{ marginLeft: "10px" }} className="btn btn-danger" data-id={props.id} onClick={props.handleDelete}>Delete</button>
            </div>
        </div>
    </div>
);

class PartPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parts: [],
            interval: 0,
            err: ''
        }

    }

    componentWillMount = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                this.setState({ parts: result.data })
            })
            .catch(err => this.setState({ err }))
    }

    componentDidMount = () => {
        let x = setInterval(() => {
            Axios.get('/api/v1/parts/all')
                .then(result => this.setState({ parts: result.data }))

        }, 15000);
        this.setState({ interval: x });
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

    handleEdit = event => {
        const id = event.target.getAttribute('data-id');
        Axios.get(`/api/v1/parts/edit/${id}`)
            .then(result => {
                if(result.data.err){
                    this.setState({err: result.data.err});
                    return;
                }
                sessionStorage.setItem('editPart', JSON.stringify(result.data));
                document.getElementById('create-link').click();
            })
            .catch(err => this.setState({ err }))
    }

    handleDelete = event => {
        const id = event.target.getAttribute('data-id');
        Axios.put(`/api/v1/parts/archive/${id}`)
            .then(result => {
                if(result.data.err){
                    this.setState({err: result.data.err})
                    return;
                }
                Axios.get('/api/v1/parts/all')
                    .then(result => {
                        if(result.data.err){
                            this.setState({err: result.data.err});
                            return;
                        }
                        this.setState({ parts: result.data })
                    })
                    .catch(err => this.setState({ err }))
            })
            .catch(err => this.setState({ err }))
    }

    render = props => (
        <div className="container">
            <div className="row">
                <h1 style={{color: 'red'}}>{this.state.err}</h1>
            </div>
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/parts/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link id="create-link" to="/admin/parts/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/parts/create" component={PartForm} />
            <Route path="/admin/parts/view" component={() => <ViewParts parts={this.state.parts} viewAttachment={this.viewAttachment} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />} />
        </div>
    )
}
export default PartPage;