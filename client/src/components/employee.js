import React from "react";
import MenuBar from "./workStations/menu-bar/index";
// import ColdSaw from "./workStations/pages/coldsaw";
// import Grinding from "./workStations/pages/grinding";
// import Laser from "./workStations/pages/laser";
// import PressBrake from "./workStations/pages/pressBrake";
// import Programming from "./workStations/pages/programming";
// import TubeBender from "./workStations/pages/tubeBender";
// import Welding from "./workStations/pages/welding";
// import { Route } from 'react-router-dom';
import Axios from 'axios';
import WorkOrder from './WorkOrder';


class Employee extends React.Component {
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

  handleJobStart = (event) => {
    const id = event.target.value;
    const arr = this.state.workOrders.slice(0);
    arr.forEach(workOrder => {
      if(workOrder.id === id){
        workOrder.inProgress = true;
      }
      else{
        workOrder.inProgress = false;
      }
    })
    this.setState({workOrders: arr});
  }

  handleJobStop = (event) => {
    const arr = this.state.workOrders.slice(0);
    arr.forEach(workOrder => {
        workOrder.inProgress = false;
    });
    this.setState({workOrders: arr});
  }

  render() {
    return (
      <div>
        <MenuBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} />
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

export default Employee;
