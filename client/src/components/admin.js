import React from "react";
import AdminBar from "./workStations/admin-menu-bar/index";
import Axios from 'axios';
import WorkOrder from './WorkOrder';

class Admin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        stations: [],
        workOrders: []
      }
  
      Axios.get('/api/v1/stations/all')
        .then(result => this.setState({ stations: result.data }));
    }
  
    handleStationSelect = (event) => {
      Axios.get(`/api/v1/workorders/active/${event.target.getAttribute('data-id')}`)
        .then(result => {
          const arr = [];
          result.data.forEach(workOrder => arr.push({...workOrder, inProgress: false}));
          this.setState({workOrders: arr});
        });
    }
  
    render() {
      return (
        <div>
          <AdminBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} />
          <div className="container">
            {this.state.workOrders.map(workOrder => {
                if(workOrder.inProgress){  
                 return <WorkOrder key={workOrder.id} id={workOrder.id} onToggle={this.handleJobStop} inProgress={workOrder.inProgress} text={workOrder.text} title="this is a work order" />
                }
                else{
                  return <WorkOrder key={workOrder.id} id={workOrder.id} onToggle={this.handleJobStart} inProgress={workOrder.inProgress} text={workOrder.text} title="this is a work order" />
                }
            })}
          </div>
        </div>
      );
    }
  }
  
  export default Admin;