import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/storage');

export default class WorkOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workOrders: null,
            parts: null,
            part: null,
            quantity: '',
            notes: '',
            err: null,
            modalErr: null,
        }
    }

    componentDidMount = () => {
        this.handleRefresh();
        const modal = document.getElementById('modal');
        M.Modal.init(modal);
    }

    componentDidUpdate = () => {
        const select = document.querySelector('select');
        M.FormSelect.init(select);
    }

    handleRefresh = () => {
        Axios.get('/api/v1/workorders/active')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }
                this.setState({ workOrders: result.data })
            })
            .catch(err => this.setState({ err }))

        Axios.get('/api/v1/parts/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }
                this.setState({ parts: result.data, part: result.data[0]})
            })
            .catch(err => this.setState({ err }))
    }

    handleTextChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value, modalErr: null })
    }

    handleSelectChange = event => {
        const select = document.querySelector('select');
        const instance = M.FormSelect.getInstance(select);
        const value = JSON.parse(instance.getSelectedValues());
        console.log(value);
    }

    handleSubmit = () => {
        if (isNaN(this.state.quantity)) {
            this.setState({ modalErr: 'Quantity must be a number.' })
            return;
        }
    }

    viewAttachment = filepath => {
        firebase.storage().ref(filepath).getDownloadURL()
            .then(url => window.open(url, '_blank'));
    }

    showModal = () => {
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    hideModal = () => {
        const modal = document.getElementById('modal');
        const instance = M.Modal.getInstance(modal);
        instance.close();
    }

    clear = () => {
        this.setState({ err: null, modalErr: null, quantity: '', notes: '' });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h5 className="red-text">{this.state.err ? this.state.err.message : null}</h5>
                </div>
                <div className="fixed-action-btn">
                    <button className="btn-floating blue" onClick={this.showModal}><i className="material-icons">add</i></button>
                </div>
                <div className="row">
                    {this.state.workOrders ? this.state.workOrders.map((wo, index) => {
                        return (
                            <div key={index} className="col s12 m4 l3">
                                <div className="card">
                                    <div className="card-content">
                                        <h5>{wo.part.name}</h5>
                                        <p>Date Created: {new firebase.firestore.Timestamp(wo.dateCreated.seconds, wo.dateCreated.nanoseconds).toDate().toLocaleDateString()}</p>
                                        <p>Current Station: {wo.currentStation.name}</p>
                                        <p>Order Quantity: {wo.quantity}</p>
                                        <p>Remaining Quantity: {wo.quantity - wo.partialQty}</p>
                                    </div>
                                    <div className="card-action">
                                        {wo.part.filename === 'No File' ?
                                            <a href="/" className="grey-text" onClick={e => e.preventDefault()}>Attachment</a>
                                            :
                                            <a href="/" className="blue-text" onClick={e => { e.preventDefault(); this.viewAttachment(`${wo.part.id}/${wo.part.filename}`) }}>Attachment</a>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
                <div className="modal" id="modal">
                    <div className="container">
                        <div className="row">
                            <h5 className="red-text">{this.state.modalErr ? this.state.modalErr : null}</h5>
                        </div>
                        <div className="row">
                            <h5>Create New Work Order</h5>
                        </div>
                        <div className="row">
                            <form>
                                <div className="row">
                                    <div className="input-field">
                                        <select onChange={this.handleSelectChange} >
                                            {this.state.parts ? this.state.parts.map((part, index) => {
                                                return <option key={index} value={JSON.stringify(part)}>{part.name}</option>
                                            }) : <option disabled>Parts Failed to Load</option>}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <input type="text" name="quantity" id="quantity" onChange={this.handleTextChange} value={this.state.quantity} />
                                        <label htmlFor="quantity">Quantity</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <textarea name="notes" id="textarea" className="materialize-textarea" onChange={this.handleTextChange} value={this.state.notes} />
                                        <label htmlFor="textarea">Notes</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div style={{ height: '30vh' }} />
                </div>
            </div>
        )
    }
}