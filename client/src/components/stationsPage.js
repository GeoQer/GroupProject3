import React from 'react';
import Axios from 'axios';
import { Modal } from 'react-bootstrap';
import "./stations.css";

class StationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            showModal: false,
            newStation: null,
            err: ''
        }
    }

    componentWillMount = () => {
        Axios.get('/api/v1/stations/all')
            .then(result => {
                if(result.data.err){
                    this.setState({err: result.data.err});
                    return;
                }
                this.setState({ stations: result.data })
            })
            .catch(err => this.setState({ err }));
    }

    closeModal = () => {
        this.setState({ showModal: false, newStation: null }, () => {
            document.getElementById('name-input').value = '';
        })
    }

    showModal = () => { this.setState({ showModal: true }) }

    handleAdd = event => {
        event.preventDefault();
        if (this.state.newStation === null) {
            return;
        }

        Axios.post('/api/v1/stations/create', {
            stationName: this.state.newStation
        })
            .then(result => {
                Axios.get('/api/v1/stations/all')
                    .then(result => {
                        if(result.data.err){
                            this.setState({err: result.data.err});
                            return;
                        }
                        this.setState({ stations: result.data, showModal: false })
                    })
                    .catch(err => this.setState({ err }))
            });

    }

    handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value, err: '' });
    }

    handleDelete = event => {
        const id = event.target.getAttribute('data-id');
        Axios.put('/api/v1/stations/remove',{
            id
        })
            .then(result => {
                if(result.data.err){
                    this.setState({err: result.data.err});
                    return;
                }
                Axios.get('/api/v1/stations/all')
                    .then(result => {
                        if(result.data.err){
                            this.setState({err: result.data.err});
                            return;
                        }
                        this.setState({stations: result.data})
                    })
                    .catch(err => this.setState({ err }));
            })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h2 style={{color: 'red'}}>{this.state.err}</h2>
                </div>
                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Station Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stations.map((station, index) => (
                                <tr key={index}>
                                    <td>{station.name}</td>
                                    <td><button className="btn btn-danger" data-id={station.id} onClick={this.handleDelete}>Remove</button></td>
                                </tr>
                            )
                            )}
                            <tr><td><button className="btn btn-success" onClick={this.showModal}>Add Station</button></td></tr>
                        </tbody>
                    </table>
                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Station</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="input-group">
                                    <span className="input-group-addon" id="name">Station Name</span>
                                    <input type="text" className="form-control" id="name-input" name="newStation" placeholder="ie: Press Brake" aria-describedby="name" onChange={this.handleInput} />
                                </div>
                                <div className="input-group" style={{ marginTop: '5px' }}>
                                    <button className="btn btn-primary" onClick={this.handleAdd}>Add Station</button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default StationsPage;