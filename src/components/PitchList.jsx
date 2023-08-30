import * as React from "react";
import PropTypes from "prop-types";
import css from "../styles/PitchList.module.css";

export const PitchList = (props) => {
  const selectItem = (index) => {
    props.onSelectionChange(index);
  };

  const deselectItem = () => {
    props.onSelectionChange(null);
  };

  const getPlayString = (play) => {
    let inning = "Top";
    if (play.inning_half === 1) {
      inning = "Bot";
    }
    return `${inning} ${play.inning} (${play.balls} - ${play.strikes}) `;
  };

  const getPitchTypeString = (play) => {
    const speed = Number(play.initial_speed).toFixed(0);
    return `${play.pitch_type} ${speed} mph`;
  };

  const renderPitchEvents = (pitches) => {
    return pitches.map((event, index) => {
      return (
        <li
          key={event.play_id}
          className={css.eventsListItem}
          onMouseOver={() => selectItem(index)}
          onMouseOut={() => deselectItem()}
        >
          <span>{getPlayString(event)}</span>
          <span className={css.pitchType}>{getPitchTypeString(event)}</span>
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
  };

  return (
    <div className={css.container}>
      <p className={css.instructions}>
        <span>Hover an item to highlight it in the chart.</span>
      </p>
      {props.pitchEvents.length === 0 && (
        <p className={css.emptyList}>No pitches match the selected criteria.</p>
      )}
      {props.pitchEvents.length > 0 && (
        <ul className={css.events}>{renderPitchEvents(props.pitchEvents)}</ul>
      )}
    </div>
  );
};

PitchList.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array,
};
