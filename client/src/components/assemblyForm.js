import React from 'react';
import Axios from 'axios';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const Part = props => (
    <div>
        <h2><span className="label label-primary" style={{ float: 'left', marginRight: '7px' }}>{props.partName}</span></h2>
        <h2><span className="label label-warning" style={{ float: 'left', marginRight: '7px' }}>{props.qty}</span></h2>
        <button data-id={props.id} className="btn btn-danger" onClick={props.removePart}>x</button>
    </div>
)

class AssemblyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPart: {},
            currentQuantity: 0,
            parts: [],
            assembly: {
                name: '',
                parts: []
            },
            showModal: false,
            loaded: false,
            err: '',
            msg: ''
        }
    }

    componentWillMount = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ parts: result.data, selectedPart: result.data[0], loaded: true });
            })
            .catch(err => this.setState({ err }));
    }

    showModal = () => this.setState({ showModal: true });

    hideModal = () => this.setState({ showModal: false, currentQuantity: 0 });

    addPart = () => {
        if (!this.state.currentQuantity) {
            alert('Please input the number of parts per assembly');
            return;
        }

        const assembly = Object.assign(this.state.assembly);
        assembly.parts.push({...this.state.selectedPart, quantity: this.state.currentQuantity});
        this.setState({ assembly, showModal: false, selectedPart: this.state.parts[0] });
    }

    removePart = event => {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const assembly = Object.assign(this.state.assembly);
        const arr = this.state.assembly.parts.slice(0);
        arr.forEach((part, index) => {
            if (part.id === id) {
                arr.splice(index, 1);
            }
        })
        assembly.parts = arr;
        this.setState({ assembly })
    }

    handleInput = event => {
        const name = event.target.name;
        let assembly = Object.assign(this.state.assembly);
        assembly[name] = event.target.value;
        this.setState({ assembly, err: '' });
    }

    clear = () => {
        document.getElementById('assembly-name').value = '';
        this.setState({ assembly: { name: '', parts: [] }, currentQuantity: 0, err: '' });
    }

    handleInputQuantity = event => {
        const currentQuantity = event.target.value;
        this.setState({ currentQuantity });
    }

    handleSubmit = () => {
        if(this.state.assembly.parts.length < 1){
            this.setState({err: 'Please select a minimum of one part'});
            return;
        }
        
        if(!this.state.assembly.name){
            this.setState({err: 'Please name your new assembly'});
            return;
        }

        Axios.post('/api/v1/assemblies/create', {
            assembly: this.state.assembly
        })
        .then(result => {
            if(result.data.err){
                this.setState({err: result.data.err});
                return;
            }

            this.clear();
            this.setState({msg: 'Assembly successfully added.'});
        })

    }


    render = () => {
        return (
            <div className="container">
                <div className="row">
                    <h2 style={this.state.err ? {color: 'red'} : {color: 'green'}}>{this.state.err || this.state.msg }</h2>
                </div>
                <div className="row">
                    <form id="assembly form">
                        <div className="input-group">
                            <span className="input-group-addon" id="assembly-name-addon">Name</span>
                            <input name="name" id="assembly-name" onChange={this.handleInput} type="text" className="form-control" />
                        </div>
                        {this.state.assembly.parts ? this.state.assembly.parts.map((part, index) => <Part key={index} partName={part.name} id={part.id} removePart={this.removePart} />) : ''}
                    </form>
                    <br />
                    <button className="btn btn-success" onClick={this.showModal}>Add Part</button>
                    <br />
                    <br />
                    <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                    <button className="btn btn-danger" onClick={this.clear}>Clear</button>
                </div>
                <Modal show={this.state.showModal}>
                    <Modal.Title>Select a Part</Modal.Title>
                    <FormGroup>
                        <ControlLabel>Parts</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select a part" onChange={this.handleSelectChange}>
                            {this.state.loaded ? this.state.parts.map((part, index) => <option key={index} value={part.id}>{part.name}</option>) : 'Loading...'}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Quantity per Assembly</ControlLabel>
                        <FormControl type="number" onChange={this.handleInputQuantity}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <button className="btn btn-success" onClick={this.addPart}>OK</button>
                        <button className="btn btn-danger" onClick={this.hideModal}>Cancel</button>
                    </FormGroup>
                </Modal>
            </div>
        )
    }
}

export default AssemblyForm;