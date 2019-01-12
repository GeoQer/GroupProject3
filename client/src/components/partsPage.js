import React from 'react';
import PartForm from './partForm';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';
const firebase = require('firebase/app');
require('firebase/storage');
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
        <div className="table-resonsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Parts</th>
                    </tr>
                </thead>
                <tbody>
                    {props.parts.map(part => (
                        <tr key={part.id}>
                            <td>{part.name}</td>
                            <td><button className="btn btn-primary" data-filepath={part.filepath} onClick={props.viewAttachment}>View Attachment</button></td>
                            <td><button className="btn btn-danger" data-id={part.id} onClick={props.handleEdit}>Edit</button></td>
                        </tr>))}
                </tbody>
            </table>
        </div>
    </div>
)


class PartPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parts: []
        }

    }

    componentWillMount = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => this.setState({ parts: result.data }));
    }

    componentWillUpdate = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => this.setState({ parts: result.data }))
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
        console.log("ID: ", id, this.state);
        Axios.get(`/api/v1/parts/edit/${id}`)
            .then(result => sessionStorage.setItem('editPart', JSON.stringify(result.data)));
        document.getElementById('create-link').click();
    }

    render = props => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/parts/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link id="create-link" to="/admin/parts/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/parts/create" component={PartForm} />
            <Route path="/admin/parts/view" component={() => <ViewParts parts={this.state.parts} viewAttachment={this.viewAttachment} handleEdit={this.handleEdit} />} />
        </div>
    )
}
export default PartPage;