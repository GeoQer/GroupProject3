import React, { Component } from "react";
import MenuBar from "./workStations/menu-bar/index";
import ColdSaw from "./workStations/pages/coldsaw";
import Grinding from "./workStations/pages/grinding";
import Laser from "./workStations/pages/laser";
import PressBrake from "./workStations/pages/pressBrake";
import Programming from "./workStations/pages/programming";
import TubeBlender from "./workStations/pages/tubeBlender";
import Welding from "./workStations/pages/welding";

class Employee extends Component {
  state = {
    currentPage: "Home"
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  renderPage = () => {
    if (this.state.currentPage === "Home") {
      return <Home />;
    } else if (this.state.currentPage === "ColdSaw") {
      return <ColdSaw />;
    } else if (this.state.currentPage === "Grinding") {
      return <Grinding />;
    } else if (this.state.currentPage === "Laser") {
      return <Laser />;
    } else if (this.state.currentPage === "PressBrake") {
      return <PressBrake />;
    } else if (this.state.currentPage === "Programming") {
      return <Programming />;
    } else if (this.state.currentPage === "TubeBlender") {
      return <TubeBlender />;
    } else if (this.state.currentPage === "Welding") {
      return <Welding />;
    } 
  };

  render() {
    return (
      <div>
        <MenuBar
          currentPage={this.state.currentPage}
          handlePageChange={this.handlePageChange}
        />
        {this.renderPage()}
      </div>
    );
  }
}

export default Employee;
