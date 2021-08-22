import * as React from "react";
import PropTypes from "prop-types";
import {PitchList} from "./pitch_list";
import css from './chart_pitch_zone.module.css';

// TODO(kaisers): put in a shared file
const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

export class ChartPitchZone extends React.Component {
  constructor(props) {
    super(props);
    this.drawZone = this.drawZone.bind(this);
    this.changeSelectedPitch = this.changeSelectedPitch.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    this.drawZone(nextProps.pitchEvents || []);
  }
  
  changeSelectedPitch(event) {
    // TODO(kaisers): draw highlighted pitch on canvas
    console.log('changeSelectedPitch', event);
  }
  
  drawZone(pitchEvents) {
    pitchEvents = pitchEvents || [];
    console.log('%c pitchEvents zone', 'background: orange;', pitchEvents);
    // TODO(kaisers): Implement canvas drawing
  }
  
  render() {
    return (
      <>
        <div className={css.chartContainer}>
          <canvas height="375" width="375"></canvas>
          <img
            className={`${css.chartBatter} ${css.rh}`}
            src="https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2FRH_batter_outline.svg?v=1629176382879"
            alt="Right hand batter"
          />
          <img
            className={`${css.chartBatter} ${css.lh}`}
            src="https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2FLH_batter_outline.svg?v=1629176385629"
            alt="Left hand batter"
          />
        </div>
        <PitchList pitchEvents={this.props.pitchEvents} 
          onSelectionChange={this.changeSelectedPitch} />
      </>
    );
  }
}

ChartPitchZone.propTypes = {
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array,
}