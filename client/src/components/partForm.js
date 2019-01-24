import React from 'react';
import Axios from 'axios';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import "./partForm.css";
const firebase = require('firebase/app');
require('firebase/storage');

const Station = props => (
    <div>
        <h2><span className="label label-primary" style={{ float: "left", marginRight: "7px" }}>{props.stationName}</span></h2>
        <button data-id={props.id} className="btn btn-danger" onClick={props.removeStation}>x</button>
    </div>
)

class PartForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStation: {},
            stations: [],
            part: {
                id: '',
                name: '',
                doc: '',
                stations: []
            },
            showModal: false,
            loaded: false,
            err: ''
        }
    }

    componentWillMount = () => {
        Axios.get('/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                this.setState({ stations: result.data, selectedStation: result.data[0], loaded: true })
            })
            .catch(err => this.setState({ err }));
    }

    componentDidMount = () => {
        let editPart = sessionStorage.getItem('editPart');

        if (editPart !== "false" && editPart) {
            editPart = JSON.parse(editPart);
            this.setState({ part: editPart }, () => {
                document.getElementById('part-id').value = this.state.part.id;
                document.getElementById('part-name').value = this.state.part.name;
            });
        }

        sessionStorage.setItem('editPart', false);

    }


    removeStation = event => {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const obj = Object.assign(this.state.part);
        const arr = this.state.part.stations.slice(0);
        arr.forEach((station, index) => {
            if (station.id === id) {
                arr.splice(index, 1);
            }
        })
        obj.stations = arr;
        this.setState({ part: obj });
    };

    showModal = () => this.setState({ showModal: true })

    hideModal = () => this.setState({ showModal: false });

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        this.setState({ selectedStation: { id, name } });
    }

    addStation = () => {
        const obj = Object.assign(this.state.part);
        obj.stations.push(this.state.selectedStation);
        this.setState({ part: obj, showModal: false, selectedStation: this.state.stations[0], err: '' });
    }

    handleInput = (event) => {
        const name = event.target.name;
        let obj = Object.assign(this.state.part);
        obj[name] = event.target.value;
        this.setState({ part: obj, err: '' });
    }

    clear = () => {
        document.getElementById('part-id').value = '';
        document.getElementById('attachment').value = '';
        document.getElementById('part-name').value = '';
        this.setState({ part: { id: '', stations: [] }, err: '' });
    }

    handleSubmit = () => {
        if (this.state.part.stations.length < 1) {
            this.setState({err: 'Please select a minimum of one station'});
            return;
        }

        this.setState({ err: ''})

        const file = document.getElementById('attachment').files[0];

        if (file !== undefined) {
            var reader = new FileReader();
            reader.onloadend = (e) => {
                const blob = new Blob([e.target.result], { type: file.type });
                Axios.post('/api/v1/parts/create', {
                    part: { ...this.state.part, filename: file.name }
                })
                    .then(response => {
                        if (response.data.err) {
                            this.setState({ err: response.data.err });
                            return;
                        }

                        this.clear();
                        const ref = firebase.storage().ref(`/${response.data.newPartID}/${file.name}`);
                        ref.put(blob)
                            .then(() => console.log('success'), () => this.setState({err: 'An unknown error occurred.'}));
                    })
                    .catch(err => this.setState({ err }))
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            Axios.post('/api/v1/parts/create', {
                part: { ...this.state.part, filename: 'no file' }
            })
                .then(response => {
                    if(response.data.err){
                        this.setState({err: response.data.err });
                        return;
                    }
                    this.clear()
                })
                .catch(err => this.setState({ err }));
        }
    }

    render = () => {
        return (
            <div className="container">
                <div className="row">
                    <h1 style={{color: 'red'}}>{this.state.err}</h1>
                </div>
                <div className='row'>
                    <div className='col-sm-4'>
                        <form id="part-form" action="/api/v1/parts/test" method="POST">
                            <div className="input-group">
                                <span className="input-group-addon" id="part-number-addon">Part ID</span>
                                <input name="id" id="part-id" onChange={this.handleInput} type="text" className="form-control" placeholder="If left blank an ID will be auto-generated" aria-describedby="part-number-addon" />
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon" id="part-name-addon">Part Name</span>
                                <input name="name" id="part-name" onChange={this.handleInput} type="text" className="form-control" />
                            </div>
                            <div className="input-group">
                                <input name="doc" id="attachment" onChange={this.handleInput} type="file" className="form-control" aria-describedby="part-document-addon" />
                            </div>
                            {this.state.part.stations ? this.state.part.stations.map((station, index) => <Station key={index} stationName={station.name} id={station.id} removeStation={this.removeStation} />) : ''}
                        </form>
                        <br />
                        <button className="btn btn-success" onClick={this.showModal}>Add Station</button>
                        <br />
                        <hr />

                        <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                        <button className="btn btn-danger" onClick={this.clear}>Clear</button>

                        <Modal show={this.state.showModal}>
                            <Modal.Title>Select a Station</Modal.Title>
                            <FormGroup>
                                <ControlLabel>Stations</ControlLabel>
                                <FormControl componentClass="select" placeholder="Select a station" onChange={this.handleSelectChange}>
                                    {this.state.loaded ? this.state.stations.map(station => <option key={station.id} value={station.id}>{station.name}</option>) : 'Loading ...'}
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <button className="btn btn-success" onClick={this.addStation}>OK</button>
                                <button className="btn btn-danger" onClick={this.hideModal}>Cancel</button>
                            </FormGroup>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}



export default PartForm;