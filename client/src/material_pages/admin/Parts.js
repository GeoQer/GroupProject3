import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';
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

export default class Parts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: null,
            stations: null,
            err: null,
            errModal: null
        }
    }

    componentDidMount = () => {
        this.handleRefresh();
        const modal = document.getElementById('modal');
        const select = document.querySelector('select');
        M.Modal.init(modal);
        M.FormSelect.init(select);
    }

    componentDidUpdate = () => {
        const select = document.querySelector('select');
        M.FormSelect.init(select);
    }

    handleRefresh = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ parts: result.data });
            })
            .catch(err => this.setState({ err }))

        Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ stations: result.data }, () => console.log);
            })
            .catch(err => this.setState({ err }))

    }

    handleTextChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    handleSelectChange = event => {
        const select = event.target;
        const instance = M.FormSelect.getInstance(select);
        const newPartStations = [];
        instance.getSelectedValues().forEach(value => newPartStations.push(JSON.parse(value)))
        this.setState({ newPartStations }, () => console.log(this.state));
    }

    handleDelete = id => {
        Axios.put(`/api/v1/parts/archive/${id}`)
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.handleRefresh();
            })
            .catch(err => this.setState({ err }))
    }

    showModal = event => {
        event.preventDefault();
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    handleSubmit = event => {
        event.preventDefault();

        if (!this.state.newPartStations || this.state.newPartStations.length < 1) {
            this.setState({ errModal: 'Please select a minimum of one station' });
            return;
        }

        if (!this.state.name || this.state.name.length < 4) {
            this.setState({ errModal: 'Part Names must be at least 4 letters long' });
            return;
        }

        const file = document.getElementById('attachment').files[0];
        if (file !== undefined) {
            var reader = new FileReader();
            reader.onloadend = e => {
                const blob = new Blob([e.target.result], { type: file.type });
                Axios.post('/api/v1/parts/create', {
                    part: {
                        name: this.state.name,
                        stations: this.state.newPartStations,
                        filename: file.name
                    }
                })
                    .then(result => {
                        if (result.data.err) {
                            this.setState({ err: result.data.err });
                            return;
                        }

                        const ref = firebase.storage().ref(`/${result.data.newPartID}/${file.name}`);
                        console.log(ref);
                        ref.put(blob)
                            .then(() => console.log('file successfully uploaded'), () => this.setState({ err: { message: 'An unknown error occured during file upload' } }));
                    })
                    .catch(err => this.setState({ err }));
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            Axios.post('/api/v1/parts/create', {
                part: {
                    name: this.state.name,
                    stations: this.state.newPartStations,
                    filename: 'no file'
                }
            })
                .then(result => {
                    if (result.data.err) {
                        this.setState({ err: result.data.err })
                        return;
                    }
                })
                .catch(err => this.setState({ err }))
        }

        this.handleRefresh();
        this.clear();
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.close();
    }

    viewAttachment = filepath => {
        firebase.storage().ref(filepath).getDownloadURL()
            .then(url => window.open(url, '_blank'));
    }

    clear = () => {
        const inputs = document.querySelectorAll('input[type=text]');
        inputs.forEach(input => input.value = '');
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach(box => {
            if(box.checked === true)
                box.click();
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h4>{this.state.err ? this.state.err.message : null}</h4>
                </div>
                <div className="fixed-action-btn">
                    <a href="/" className="btn-floating waves-effect waves-light blue" onClick={this.showModal}><i className="material-icons">add</i></a>
                </div>
                <div className="row">
                    {this.state.parts ? this.state.parts.map((part, index) => {
                        return (
                            <div key={index} className="col s12 m4 l3">
                                <div className="card" >
                                    <div className="card-content">
                                        <h5>{part.name}</h5>
                                        {part.stations.map((station, index) => {
                                            return <p key={index}>{station.name}</p>
                                        })}
                                    </div>
                                    <div className="card-action">
                                        <a href="/" className="blue-text" onClick={e => { e.preventDefault(); this.viewAttachment(part.filepath) }}>Attachment</a>
                                        {/* <a href="/" className="blue-text" onClick={e => { e.preventDefault(); this.handleEdit(part) }}>Edit</a> */}
                                        <a href="/" className="blue-text" onClick={e => { e.preventDefault(); this.handleDelete(part.id) }}>Delete</a>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
                <div id="modal" className="modal">
                    <div className="container" style={{ minHeight: '60vh' }}>
                        <div className="row">
                            <div style={{height: '12px'}} />
                        </div>
                        <div className="row">
                            <h4 className="red-text">{this.state.errModal ? this.state.errModal : null}</h4>
                        </div>
                        <div className="row">
                            <h4>Create New Part</h4>
                        </div>
                        <form className="row">
                            <div className="row">
                                <div className="input-field">
                                    <input name="name" type="text" id="name" onChange={this.handleTextChange} />
                                    <label htmlFor="name">Part Name</label>
                                </div>
                            </div>
                            <div className="file-field input-field">
                                <div className="btn white blue-text">
                                    <span>Attachment</span>
                                    <input id="attachment" type="file" />
                                </div>
                                <div className="file-path-wrapper">
                                    <input name="filepath" className="file-path validate" type="text" />
                                </div>
                                <div className="input-field">
                                    {this.state.stations ?
                                        <select multiple onChange={this.handleSelectChange}>
                                            {this.state.stations.map((station, index) => {
                                                return <option key={index} value={JSON.stringify(station)}>{station.name}</option>
                                            })}
                                        </select>
                                        : <p>Stations Unavailable</p>}
                                </div>
                            </div>
                            <div className="input-field">
                                <button className="btn waves-effect waves-light blue" onClick={this.handleSubmit}>Create New Part</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}