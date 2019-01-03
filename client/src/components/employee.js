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


function Employee(props) {
  return (
    <div>
      <MenuBar />
      <Route exact path={`${props.match.url}/programming`} component={Programming} />
      <Route exact path={`${props.match.url}/coldsaw`} component={ColdSaw} />
      <Route exact path={`${props.match.url}/grinding`} component={Grinding} />
      <Route exact path={`${props.match.url}/laser`} component={Laser} />
      <Route exact path={`${props.match.url}/pressbrake`} component={PressBrake} />
      <Route exact path={`${props.match.url}/tubebender`} component={TubeBender} />
      <Route exact path={`${props.match.url}/welding`} component={Welding} />
    </div>
  );
}

export default Employee;
