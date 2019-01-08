import React from 'react';
import Axios from 'axios';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

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
            stations: [],
            part: {
                id: '',
                stations: []
            },
            showModal: false
        }
        Axios.get('/api/v1/stations/all')
            .then(result => this.setState({stations: result.data}));
    };

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

    showModal = () => this.setState({showModal: true})

    hideModal = () => this.setState({showModal: false});

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        this.setState({ selectedStation: { id, name } });
    }

    addStation = () => {
        const obj = Object.assign(this.state.part);
        obj.stations.push(this.state.selectedStation);
        this.setState({part: obj, showModal: false, selectedStation: this.state.stations[0]});
    }

    handlePartIdInput = (event) => {
        let obj = Object.assign(this.state.part);
        obj.id = event.target.value;
        this.setState({part: obj}); 
    }

    clear = () => {
        document.getElementById('part-id').value = '';
        this.setState({part: {id: '', stations: []}});
    }

    handleSubmit = () => {
        console.log('submitting');
        Axios.post('/api/v1/parts/create', {
            part: this.state.part
        })
        .then(response => console.log(response));
    }

    render() {
        return (
            <div className="container">
                <form>
                    <div className="input-group">
                        <span className="input-group-addon" id="part-number-addon">Part ID</span>
                        <input id="part-id" onChange={this.handlePartIdInput} type="text" className="form-control" placeholder="If left blank an ID will be auto-generated" aria-describedby="part-number-addon" />
                    </div>
                    {this.state.part.stations.map((station, index) => <Station key={index} stationName={station.name} id={station.id} removeStation={this.removeStation} />)}
                </form>
                <br />
                <button className="btn btn-success" onClick={this.showModal}>Add Station</button>
                <br />
                <hr />
                <div className="row">
                    <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                    <button className="btn btn-danger" onClick={this.clear}>Clear</button>
                </div>
                <Modal show={this.state.showModal}>
                    <Modal.Title>Select a Station</Modal.Title>
                    <FormGroup>
                        <ControlLabel>Stations</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select a station" onChange={this.handleSelectChange}>
                            {this.state.stations.map(station => <option key={station.id} value={station.id}>{station.name}</option>)}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <button className="btn btn-success" onClick={this.addStation}>OK</button>
                        <button className="btn btn-danger" onClick={this.hideModal}>Cancel</button>
                    </FormGroup>
                </Modal>
            </div>
        )
    }                           
}


export default PartForm;