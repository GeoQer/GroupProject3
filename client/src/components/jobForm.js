import React from 'react';
import Axios from 'axios';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
const firebase = require('firebase/app');
require('firebase/storage');

const Part = props => (
    <div>
        <h2><span className="label label-primary" style={{ float: "left", marginRight: "7px" }}>{props.partName}</span></h2>
        <button data-id={props.id} className="btn btn-danger" onClick={props.removePart}>x</button>
    </div>
)

class JobForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPart: {},
            parts: [],
            job: {
                id: '',
                quantity: '',
                parts: []
            },
            showModal: false
        }
        Axios.get('/api/v1/work-orders/all')
            .then(result => this.setState({ parts: result.data, selectedPart: result.data[0] }));
    };

    removePart = event => {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const obj = Object.assign(this.state.job);
        const arr = this.state.job.parts.slice(0);
        arr.forEach((part, index) => {
            if (part.id === id) {
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
        this.setState({ selectedPart: { id, name } });
    }

    addStation = () => {
        const obj = Object.assign(this.state.job);
        obj.stations.push(this.state.selectedPart);
        this.setState({ part: obj, showModal: false, selectedJob: this.state.parts[0] });
    }

    handleInput = (event) => {
        const name = event.target.name;
        let obj = Object.assign(this.state.job);
        obj[name] = event.target.value;
        this.setState({ job: obj });
    }

    clear = () => {
        document.getElementById('job-id').value = '';
        this.setState({ part: { id: '', parts: [] } });
    }

    handleSubmit = async () => {
        if(this.state.job.parts.length < 1){
            console.log('There is no information to post');
            return;
        }


        const file = document.getElementById('attachment').files[0];

        if (file !== undefined) {
            var reader = new FileReader();
            reader.onloadend = (e) => {
                const blob = new Blob([e.target.result], { type: file.type });

                Axios.post('/api/v1/work-orders/create', {
                    job: {...this.state.part, filename: file.name}
                })
                .then(response => {
                    const ref = firebase.storage().ref(`/${response.data.newPartID}/${file.name}`);
                    ref.put(blob)
                        .then(() => console.log('success'), () => console.log('error'));
                })
            }
            reader.readAsArrayBuffer(file);
        }
        else{
            Axios.post('/api/v1/work-orders/create', {
                job: {...this.state.job, filename: 'no file'}
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <div className="container">
                <form id="job-form" action="/api/v1/work-orders/test" method="POST">
                    <div className="input-group">
                        <span className="input-group-addon" id="job-number-addon">Job ID</span>
                        <input name="id" id="job-id" onChange={this.handleInput} type="text" className="form-control" placeholder="If left blank an ID will be auto-generated" aria-describedby="job-number-addon" />
                    </div>
                    <div className="input-group">
                        <input name="doc" id="attachment" onChange={this.handleInput} type="file" className="form-control" aria-describedby="job-document-addon" />
                    </div>
                    {this.state.job.parts.map((part, index) => <Part key={index} partName={part.name} id={part.id} removePart={this.removePart} />)}
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
                    <Modal.Title>Select a Part</Modal.Title>
                    <FormGroup>
                        <ControlLabel>Parts</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select a part" onChange={this.handleSelectChange}>
                            {this.state.parts.map(part => <option key={part.id} value={part.id}>{part.name}</option>)}
                        </FormControl>
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


export default JobForm;