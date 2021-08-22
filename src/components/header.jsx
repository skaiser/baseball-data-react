import * as React from "react";
import {Welcome} from "./welcome";

export class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <Welcome name={this.props.name} />
        <span className="flex-spacer"></span>
        <img className="logo" alt="Logo" src={this.props.logo} />
      </div>
    );
  }
}
