import React from 'react';
import PartForm from './partForm';
import { Route, Link } from 'react-router-dom';

class PartPage extends React.Component {

    handleTabSelect = (event) =>{
        const target = event.target;
        const tabs = document.getElementsByClassName('tab-link');
        for(let i = 0; i < tabs.length; i++){
            tabs[i].setAttribute('class', 'tab-link');
        }
        target.parentElement.setAttribute('class', 'active tab-link');
    }

    render = props => (
        <div className="container">
            <ul className="nav nav-pills">
                <li role="presentation" className="active tab-link" onClick={this.handleTabSelect}><Link to="/admin/parts/view-all">View</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/parts/edit">Edit</Link></li>
                <li role="presentation" className="tab-link" onClick={this.handleTabSelect}><Link to="/admin/parts/create">Create</Link></li>
            </ul>
            <br />
            <br />
            <Route path="/admin/parts/create" component={PartForm} />
        </div>
    )
}
export default PartPage;