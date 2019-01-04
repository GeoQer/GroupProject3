import React from "react";
import MenuBar from "./workStations/menu-bar/index";
import ColdSaw from "./workStations/pages/coldsaw";
import Grinding from "./workStations/pages/grinding";
import Laser from "./workStations/pages/laser";
import PressBrake from "./workStations/pages/pressBrake";
import Programming from "./workStations/pages/programming";
import TubeBender from "./workStations/pages/tubeBender";
import Welding from "./workStations/pages/welding";
import { Route } from 'react-router-dom';
import Axios from 'axios';


class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
    }

    Axios.get('/api/v1/stations/all')
      .then(result => this.setState({stations: result.data}));

  }

  render(props) {
    return (
      <div>
        <MenuBar stations={this.state.stations}/>
        <Route exact path={`/employee/programming`} component={Programming} />
        <Route exact path={`/employee/coldsaw`} component={ColdSaw} />
        <Route exact path={`/employee/grinding`} component={Grinding} />
        <Route exact path={`/employee/laser`} component={Laser} />
        <Route exact path={`/employee/pressbrake`} component={PressBrake} />
        <Route exact path={`/employee/tubebender`} component={TubeBender} />
        <Route exact path={`/employee/welding`} component={Welding} />
      </div>
    );
  }
}

export default Employee;
