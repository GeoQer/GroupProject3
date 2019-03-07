import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';

export default class Stations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stations: null,
            name: '',
            err: null,
            modalErr: null
        }
    }

    componentDidMount = () => {
        this.handleRefresh();
        const modal = document.getElementById('modal');
        M.Modal.init(modal);
    }

    handleRefresh = () => {
        Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }

                this.setState({ stations: result.data })
            })
            .catch(err => this.setState({ err }))
    }

    handleStationDelete = id => {
        Axios.put('/api/v1/stations/remove', {
            id
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.handleRefresh();
            })
            .catch(err => this.setState({ err }))
    }

    handleTextInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value, modalErr: '' });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.handleStationCreate(this.state.name);
    }

    handleStationCreate = name => {
        if (!name || name.length < 4) {
            this.setState({ modalErr: 'Station names must be at least 4 letters long.' })
            return;
        }

        Axios.post('/api/v1/stations/create', {
            stationName: name
        })
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

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="fixed-action-btn right">
                        <a href="/" className="btn-floating blue waves-effect waves-light" onClick={this.showModal}><i className="material-icons">add</i></a>
                    </div>
                </div>
                <div className="row">
                    <h4 className="red-text">{this.state.err ? this.state.err.message : null}</h4>
                </div>
                <div className="row">
                    <table>
                        <thead>
                            <tr>
                                <th>Station Name</th>
                                <th>Remove Station</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stations ? this.state.stations.map((station, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{station.name}</td>
                                        <td><button className="btn waves-effect waves-light red-text btn-flat white" onClick={() => this.handleStationDelete(station.id)}>Delete</button></td>
                                    </tr>
                                )
                            }) : null}
                        </tbody>
                    </table>
                </div>
                <div className="modal" id="modal">
                    <div className="modal-content">
                        <h4>Create New Station</h4>
                        <form className="col">
                            <div className="row">
                                <div className="input-field">
                                    <input id="name" name="name" type="text" onChange={this.handleTextInput} value={this.state.name} />
                                    <label htmlFor="name">Station Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field">
                                    <button className="btn waves-effect waves-light blue" onClick={this.handleSubmit}>Create</button>
                                </div>
                            </div>
                            <div className="row">
                                <h5 className="red-text">{this.state.modalErr ? this.state.modalErr : null}</h5>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}