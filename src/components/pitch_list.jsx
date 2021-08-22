import * as React from "react";
import PropTypes from "prop-types";
import css from "./pitch_list.module.css";

export class PitchList extends React.Component {
  selectItem(index) {
    this.props.onSelectionChange(index);
  }

  deselectItem() {
    this.props.onSelectionChange(null);
  }

  getPlayString(play) {
    let inning = "Top";
    if (play.inning_half === 1) {
      inning = "Bot";
    }
    return `${inning} ${play.inning} (${play.balls} - ${play.strikes}) `;
  }

  getPitchTypeString(play) {
    const speed = Number(play.initial_speed).toFixed(0);
    return `${play.pitch_type} ${speed} mph`;
  }

  renderPitchEvents(pitches) {
    return pitches.map((event, index) => {
      return (
        <li
          key={event.play_id}
          className={css.eventsListItem}
          onMouseOver={() => this.selectItem(index)}
          onMouseOut={() => this.deselectItem()}
        >
          <span>{this.getPlayString(event)}</span>
          <span className={css.pitchType}>
            {this.getPitchTypeString(event)}
          </span>
          <br />
          <span>
            {event.batter_name} vs {event.pitcher_name}
          </span>
          <br />
          <span className={css.eventType}> {event.event_type} </span>
          <span className={css.eventResult}>{event.event_result}</span>
        </li>
      );
    });
  }

  render() {
    return (
      <div className={css.container}>
        <p className={css.instructions}>
          <span>Hover an item to highlight it in the chart.</span>
        </p>
        <ul className={css.events}>
          {this.renderPitchEvents(this.props.pitchEvents)}
        </ul>
      </div>
    );
  }
}

PitchList.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array
};
