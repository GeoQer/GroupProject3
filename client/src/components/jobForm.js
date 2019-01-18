import React from 'react';
import Axios from 'axios';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

// const Part = props => (
//     <div>
//         <h2><span className="label label-primary" style={{ float: "left", marginRight: "7px" }}>{props.partName}</span></h2>
//         <button data-id={props.id} className="btn btn-danger" onClick={props.removePart}>x</button>
//     </div>
// )

class JobForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: [],
            job: {
                part: "Select a Part",
                quantity: 0,
                notes: ''
            },
        }
    };

    clear = () => {
        let selector = document.getElementById('selector');
        selector.selectedIndex = 0;
        document.getElementById('notes').value = '';
        document.getElementById('qty').value = '';
        this.setState({job: {part: 'Selecta a Part', quantity: 0, notes: ''}});
    }

    componentWillMount = () => {
        Axios.get('/api/v1/parts/all')
            .then(result => this.setState({parts: result.data}))
    }

    handleSelectChange = (event) => {
        const id = event.target.value;
        const name = event.target.children[event.target.selectedIndex].text;
        const job = Object.assign(this.state.job);
        job.part = {id, name};
        this.setState({ job, errMsg: '' });
    }

    handleInput = (event) => {

        const name = event.target.name;
        let obj = Object.assign(this.state.job);
        obj[name] = event.target.value;
        this.setState({ job: obj, errMsg: '' });
    }

    handleSubmit = async () => {
        if(this.state.job.part === 'Select a Part' || this.state.job.quantity < 1){
            this.setState({errMsg: 'Please make sure you have selected a Part and set a Quantity'})
            return;
        }
        Axios.post('/api/v1/workorders/create', {
            job: this.state.job
        })
        .then(result => {
            this.clear();
        })
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
                        <FormGroup>
                            <ControlLabel>Parts</ControlLabel>
                            <FormControl componentClass="select" placeholder="Select a part" onChange={this.handleSelectChange} id="selector">
                                <option>Select a Part</option>
                                {this.state.parts.map((part, index) => <option key={index} value={part.id}>{part.name}</option>)}
                            </FormControl>
                        </FormGroup>
                        <div className="input-group">
                            <span className="input-group-addon" id="job-quantity-addon">Quantity</span>
                            <input name="quantity" type="number" className="form-control" id="qty" onChange={this.handleInput} />
                        </div>
                        <div className="input-group" style={{marginTop: '10px'}}>
                            <span className="input-group-addon" id="text-area-addon">Notes</span>
                            <textarea name="notes" id="notes" onChange={this.handleInput} style={{height: '120px'}} className="form-control" aria-describedby="text-area-addon"></textarea>
                        </div>
                    </form>
                </div>
                <br />
                <div className="row">
                    <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                    <button className="btn btn-danger" onClick={this.clear}>Clear</button>
                </div>
                <div className="row">
                    <h3 style={{color: 'red'}}>{this.state.errMsg}</h3>
                </div>
            </div>
        )
    }
}


export default JobForm;