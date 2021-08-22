import * as React from "react";
import PropTypes from "prop-types";
import {PitchList} from "./pitch_list";
import {strikeTypes} from './pitch_filters';
import css from './chart_pitch_zone.module.css';


// TODO(kaisers): put in a shared file
const CHART_COLORS = Object.freeze({
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
});

const ThrowSide = Object.freeze({
  BOTH: 'BOTH',
  L: 'L',
  R: 'R',
});

// TODO(kaisers): Add more and move to a shared location
const EventType = Object.freeze({
  BALL: 'ball',
  CALLED_STRIKE: 'called_strike',
});


const HOME_PLATE_INCHES = 17;
const DEFAULT_PITCH_RADIUS = 4;
const HIGHLIGHTED_PITCH_RADIUS = 6;
// Batter's boxes and home plate are 125 inches wide.
// https://miro.medium.com/max/3400/0*U5Lb957NqbWW_bPZ.jpg
const BATTING_AREA_INCHES = 125;

function feetToInches(feet) {
  return feet * 12;
}

export class ChartPitchZone extends React.Component {
  constructor(props) {
    super(props);
    this.updateHighlightedPitch = this.updateHighlightedPitch.bind(this);
    
    this.pitchZoneRef = React.createRef();
    this.state = {  
      highlightedPitch: null,
    };
  }
  
  // This is needed to trigger a draw when the parent state updates this.props.
  componentWillReceiveProps(nextProps) {
    this.draw(nextProps.pitchEvents || []);
  }
  
  updateHighlightedPitch(indexOrNull) {
    this.setState({highlightedPitch: indexOrNull}, () => {
      this.draw(this.props.pitchEvents);
    });
  }
  
  normalizePosition(xyz) {
    return feetToInches(xyz) * this.getCanvasSizeRatio();
  }

  getCanvasSizeRatio() {
    let canvas = this.pitchZoneRef.current;
    if (!canvas) {
      return 0;
    }
    return canvas.width / BATTING_AREA_INCHES;
  }
  
  draw(pitchEvents) {
    pitchEvents = pitchEvents || [];
    console.log('%c pitchEvents zone', 'background: orange;', pitchEvents);
  
    requestAnimationFrame(() => {
      const canvas = this.pitchZoneRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext('2d');
      const canvasCenterX = canvas.width / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e1e2db';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let kZoneTop = 0;
      let kZoneBottom = canvas.height;
      const ratio = this.getCanvasSizeRatio();

      // Draw some simulated path for ball as a bottom "layer".
      for (let i = 0; i < pitchEvents.length; i++) {
        const p = pitchEvents[i];
        
        ctx.beginPath();
        ctx.moveTo(
          this.normalizePosition(p.init_pos_x) + canvasCenterX,
          canvas.height - this.normalizePosition(p.init_pos_z)
        );
        //ctx.quadraticCurveTo(normalizePosition(p.init_pos_x) + canvasCenterX - 50, canvasEl.height - normalizePosition(p.init_pos_z) - 50, normalizePosition(p.plate_x) + canvasCenterX, canvasEl.height - normalizePosition(p.plate_z));
        let curveOffset = 8 * ratio;
        if (p.pitcher_throws === ThrowSide.R) {
          curveOffset = -curveOffset;
        }
        //ctx.quadraticCurveTo(normalizePosition(p.plate_x) + (4 * ratio), normalizePosition(p.plate_z) - (4 * ratio), normalizePosition(p.plate_x) + canvasCenterX, canvasEl.height - normalizePosition(p.plate_z));
        // TODO(kaisers): Take into account release point being in distance
        ctx.quadraticCurveTo(
          this.normalizePosition(p.init_pos_x) + canvasCenterX + curveOffset,
          canvas.height - this.normalizePosition(p.init_pos_z) - curveOffset,
          this.normalizePosition(p.plate_x) + canvasCenterX,
          canvas.height - this.normalizePosition(p.plate_z)
        );
        //ctx.bezierCurveTo(normalizePosition(p.init_pos_x) + (4 * ratio), normalizePosition(p.init_pos_z), normalizePosition(p.plate_x), normalizePosition(p.plate_z) - (5 * ratio), normalizePosition(p.plate_x) + canvasCenterX, canvasEl.height - normalizePosition(p.plate_z));
        // TODO(kaisers): This needs to stack the highlight on top or draw a single pitch.
        if (i === this.state.highlightedPitch) {
          ctx.strokeStyle = CHART_COLORS.orange;
          ctx.lineWidth = 4;
        } else {
          ctx.strokeStyle = '#514e49';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }

      for (let i = 0; i < pitchEvents.length; i++) {
        let p = pitchEvents[i];
        const radius =
          i === this.state.highlightedPitch
            ? HIGHLIGHTED_PITCH_RADIUS
            : DEFAULT_PITCH_RADIUS;

        // Pitcher release point
        ctx.beginPath();
        ctx.arc(
          this.normalizePosition(p.init_pos_x) + canvasCenterX,
          canvas.height - this.normalizePosition(p.init_pos_z),
          radius,
          0,
          2 * Math.PI
        );
        // TODO(kaisers): Handle colors better and add a legend
        switch (p.pitch_type) {
          case 'CU':
            ctx.fillStyle = CHART_COLORS.blue;
            break;
          case 'SL':
            ctx.fillStyle = CHART_COLORS.red;
            break;
          case 'CH':
            ctx.fillStyle = CHART_COLORS.yellow;
            break;
          default:
            ctx.fillStyle = CHART_COLORS.purple;
            break;
        }
        if (i === this.state.highlightedPitch) {
          ctx.fillStyle = CHART_COLORS.orange;
        }
        ctx.fill();

        // ball position end position over plate
        ctx.beginPath();
        // TODO(kaisers): Need to subtract pos_y for balls that bounced in the dirt?
        ctx.arc(
          this.normalizePosition(p.plate_x) + canvasCenterX,
          canvas.height - this.normalizePosition(p.plate_z),
          radius,
          0,
          2 * Math.PI
        );
        // TODO(kaisers): Handle colors better
        if (p.event_type === EventType.BALL) {
          ctx.fillStyle = CHART_COLORS.yellow;
        } else if (strikeTypes.includes(p.event_type)) {
          ctx.fillStyle = CHART_COLORS.red;
        } else {
          ctx.fillStyle = CHART_COLORS.blue;
        }
        if (i === this.highlightedPitch) {
          ctx.fillStyle = CHART_COLORS.orange;
        }
        ctx.fill();

        // Draw strike zone last.
        // Use first batter's strike zone for simplicity.
        p = pitchEvents[0];
        kZoneTop = feetToInches(p.sz_top);
        kZoneBottom = feetToInches(p.sz_bottom);
        const homePlateSize = HOME_PLATE_INCHES * ratio;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#eeeeee';
        ctx.strokeRect(
          canvasCenterX - homePlateSize / 2,
          canvas.height - kZoneTop * ratio,
          homePlateSize,
          (kZoneTop - kZoneBottom) * ratio
        );
      }
    });
  }
  
  render() {
    return (
      <>
        <div className={css.chartContainer}>
          <canvas ref={this.pitchZoneRef} height="375" width="375"></canvas>
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
          onSelectionChange={this.updateHighlightedPitch} />
      </>
    );
  }
}

ChartPitchZone.propTypes = {
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array,
}