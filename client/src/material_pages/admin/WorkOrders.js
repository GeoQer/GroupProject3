import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';

export default class WorkOrders extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            workOrders: null,
            parts: null,
            quantity: '',
            notes: '',
            err: null,
            modalErr: null,
        }
    }
}