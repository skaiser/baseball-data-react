import * as React from "react";
import {Welcome} from "./welcome";

export const Header = (props) => {
  return (
    <div className="header">
      <Welcome name={props.name} />
      <span className="flex-spacer"></span>
      <img className="logo" alt="Logo" src={props.logo} />
    </div>
  );
}
