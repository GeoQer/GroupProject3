import React from 'react';
import { Route, Link } from 'react-router-dom';
import Axios from 'axios';
import AssemblyForm from './assemblyForm';


const ViewAssemblies = props => (
    <div className="row">
        {props.assemblies.length > 0 ? props.assemblies.map((assembly, index) => <AssemblyCard key={index} assembly={assembly} handleDelete={props.handleDelete} handleEdit={props.handleEdit} />) : ''}
    </div>
)

const AssemblyCard = props => (
    <div className="col-sm-6 col-md-4">
        <div className="thumbnail">
            <div className="caption">
                <h3 className="card-title">{props.assembly.name}</h3>
                <p><strong>Parts: </strong></p>
                {props.assembly.parts.map((part, index) => <p key={index}><b>Name: </b>{part.name} <b>Quantity: </b> {part.quantity}</p>)}
                <button style={{marginLeft: "10px"}} className="btn btn-warning" data-id={props.assembly.id} onClick={props.handleEdit}>Edit</button>
                <button style={{marginLeft: "10px"}} className="btn btn-danger" data-id={props.assembly.id} onClick={props.handleDelete}>Delete</button>
            </div>
        </div>
    </div>
)

class AssemblyPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            assemblies: [],
            interval: 0,
            err: ''
        }
    }

    componentWillMount = () => {
        Axios.get('/api/v1/assemblies/all')
        .then(result => {
            if(result.data.err){
                this.setState({err: result.data.err});
                return;
            }

            this.setState({assemblies: result.data})
        })
    }

    handleTabSelect = event => {
        const target = event.target;
        const tabs = document.getElementsByClassName('tab-link');
        for(let i = 0; i < tabs.length; i++){
            tabs[i].setAttribute('class', 'tab-link');
        }
        target.parentElement.setAttribute('class', 'active tab-link');
    }

    handleEdit = event => {
        const id = event.target.getAttribute('data-id');
        sessionStorage.setItem('isEditing', 'true');
        sessionStorage.setItem('assemblyEditID', id);
        document.getElementById('create-link').click();
    }

    handleDelete = event => {
        const id = event.target.getAttribute('data-id');
        Axios.put('/api/v1/assemblies/archive', {
            id
        })
        .then(result => {
            if(result.data.err){
                this.setState({ err: result.data.err });
                return;
            }

            Axios.get('/api/v1/assemblies/all')
                .then(result => this.setState({assemblies: result.data}))
        })
        .catch(err => this.setState({ err }))
    }

    render = () => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/assemblies/view">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link id="create-link" to="/admin/assemblies/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/assemblies/create" component={AssemblyForm} />
            <Route path="/admin/assemblies/view" component={() => <ViewAssemblies assemblies={this.state.assemblies} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />} />
        </div>
    )
}

export default AssemblyPage;