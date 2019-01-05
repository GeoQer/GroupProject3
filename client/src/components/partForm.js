import React from 'react';
import Axios from 'axios';
import { Modal, FormGroup, FormControl, ControlLabel, FieldGroup } from 'react-bootstrap';

const Process = props => (
    <FormGroup>
        <ControlLabel>{props.name}</ControlLabel>
        <FormControl
            type="file"
        />
    </FormGroup>
);

const Phase = props => (
    <div className="panel panel-primary">
        <div className="panel-heading">
            <h3 className="panel-title">{props.title}</h3>
        </div>
        <div className="panel-body">
            {props.stations.map(station => <Process id={station.id} name={station.name} /> )}
            <button data-id={props.id} className="btn btn-success" onClick={props.showModal}>Add Process</button>
        </div>
    </div>
)

class PartForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfPhases: 1,
            selectedPhase: 0,
            showModal: false,
            phases: [
                {
                    id: 1,
                    processes: []
                }
            ],
            stations: []
        };

        Axios.get('/api/v1/stations/all')
            .then(result => this.setState({ stations: result.data }));
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log('You haven\'t set this up yet');
    }

    showModal = (event) => {
        const selectedPhase = parseInt(event.target.getAttribute('data-id'));
        this.setState({ showModal: true, selectedPhase });
    }

    hideModal = () => {
        this.setState({ showModal: false, selectedPhase: 0 });
    }

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        this.setState({ selectedStation: { id, name } });
    }

    addProcess = () => {
        let arr = this.state.phases.slice(0);
        arr.forEach(phase => {
            if (phase.id === this.state.selectedPhase) {
                console.log('HERE');
                phase.processes.push({ id: this.state.selectedStation.id, name: this.state.selectedStation.name });
            }
        })
        this.setState({phases: arr, showModal: false});
    }

    addPhase = () => {
        const arr = this.state.phases.slice(0);
        const newNumberOfPhases = this.state.numberOfPhases + 1;
        arr.push({id: newNumberOfPhases, processes: []});
        this.setState({phases: arr, numberOfPhases: newNumberOfPhases}, () => console.log(this.state));
    }

    render() {
        return (
            <div className='container'>
                {this.state.phases.map(phase => {
                    return <Phase id={phase.id} key={phase.id} title={`Phase ${phase.id}`} processes={phase.processes} showModal={this.showModal} stations={phase.processes}/>
                })}
                <div>
                    <button className="btn btn-primary" onClick={this.addPhase}>Add Phase</button>
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
                        <button className="btn btn-success" onClick={this.addProcess}>OK</button>
                        <button className="btn btn-danger" onClick={this.hideModal}>Cancel</button>
                    </FormGroup>
                </Modal>
            </div>
        );
    }
}

export default PartForm;