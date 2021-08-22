import * as React from "react";

import {Header} from "../components/header";
import {PitchView} from "../components/pitch_view";
import css from './home.module.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.title = "Astros";
    this.logoUrl =
      "https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2F117.svg?v=1629180035695";
  }

  render() {
    return (
      <>
        <Header name={this.title} logo={this.logoUrl} />
        <div className={css.content}>
          <p className={css.intro}>
            Select a pitcher from the options below to view pitch stats.
          </p>
          <PitchView></PitchView>
        </div>
      </>
    );
  }
}
