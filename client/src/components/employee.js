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
import Card from '../components/Card';


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
      .then(result => this.setState({ workOrders: result.data }));
  }

  render() {
    return (
      <div>
        <MenuBar stations={this.state.stations} handleStationSelect={this.handleStationSelect} />
        {this.state.workOrders.map(workOrder => {
          return (
            <Card text={workOrder.text} title="this is a work order" />
          )
        })}
      </div>
    );
  }
}

export default Employee;
