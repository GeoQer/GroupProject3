import React from 'react';
import Axios from 'axios';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class JobForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: [],
            assemblies: [],
            job: {
                part: "Select a Part",
                quantity: 0,
                notes: '',
            },
            partTypeisSelected: true,
            err: ''
        }
    };

    clear = () => {
        let selector = document.getElementById('selector');
        selector.selectedIndex = 0;
        document.getElementById('notes').value = '';
        document.getElementById('qty').value = '';
        this.setState({ job: { part: 'Selecta a Part', quantity: 0, notes: '' } });
    }

    componentWillMount = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => this.setState({ parts: result.data }))
        Axios.get('/api/v1/assemblies/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                }
                this.setState({ assemblies: result.data })
            })
            .catch(err => this.setState({ err }))
    }

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        const job = Object.assign(this.state.job);
        job.part = { id, name };
        this.setState({ job, errMsg: '' }, () => console.log(this.state));
    }

    handleInput = (event) => {
        const name = event.target.name;
        let obj = Object.assign(this.state.job);
        obj[name] = event.target.value;
        this.setState({ job: obj, errMsg: '' });
    }

    handleSubmit = async () => {
        if (this.state.job.part === 'Select an option' || this.state.job.quantity < 1) {
            this.setState({ errMsg: 'Please make sure you have selected a Part and set a Quantity' })
            return;
        }
        Axios.post('/api/v1/workorders/create', {
            job: this.state.job,
            isAssembly: !this.state.partTypeisSelected
        })
            .then(result => {
                this.clear();
            })
    }

    handleJobTypeSelect = event => {
        event.preventDefault();
        const type = event.target.getAttribute('data-type');
        if (type === 'part')
            this.setState({ partTypeisSelected: true })
        else
            this.setState({ partTypeisSelected: false })

        const target = event.target;
        const tabs = document.getElementsByClassName('type-tab');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].setAttribute('class', 'tab-link type-tab');
        }
        target.parentElement.setAttribute('class', 'active tab-link type-tab');

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <form id="job-form" action="/api/v1/work-orders/test" method="POST">
                        <div className="input-group">
                            <span className="input-group-addon" id="job-number-addon">Job ID</span>
                            <span name="id" id="job-id" className="form-control" aria-describedby="job-number-addon">{this.state.id ? this.state.id : 'New Part'}</span>
                        </div>
                        <br />
                        <ul className="nav nav-pills">
                            <li role="presentation" className="active tab-link type-tab" onClick={this.handleJobTypeSelect}><a href="/" data-type="part">Part</a></li>
                            <li role="presentation" className="tab-link type-tab" onClick={this.handleJobTypeSelect}><a href="/" data-type="assembly">Assembly</a></li>
                        </ul>
                        <br />
                        <FormGroup>
                            <ControlLabel>{this.state.partTypeisSelected ? "Parts" : "Assemblies"}</ControlLabel>
                            <FormControl componentClass="select" placeholder="Select a part" onChange={this.handleSelectChange} id="selector">
                                <option>Select an option</option>
                                {this.state.partTypeisSelected ? this.state.parts.map((part, index) => <option key={index} value={part.id}>{part.name}</option>) : this.state.assemblies.map((assembly, index) => <option key={index} value={assembly.id}>{assembly.name}</option>)}
                            </FormControl>
                        </FormGroup>
                        <div className="input-group">
                            <span className="input-group-addon" id="job-quantity-addon">Quantity</span>
                            <input name="quantity" type="number" className="form-control" id="qty" onChange={this.handleInput} />
                        </div>
                        <div className="input-group" style={{ marginTop: '10px' }}>
                            <span className="input-group-addon" id="text-area-addon">Notes</span>
                            <textarea name="notes" id="notes" onChange={this.handleInput} style={{ height: '120px' }} className="form-control" aria-describedby="text-area-addon"></textarea>
                        </div>
                    </form>
                </div>
                <br />
                <div className="row">
                    <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                    <button className="btn btn-danger" onClick={this.clear}>Clear</button>
                </div>
                <div className="row">
                    <h3 style={{ color: 'red' }}>{this.state.errMsg}</h3>
                </div>
            </div>
        )
    }
}


export default JobForm;