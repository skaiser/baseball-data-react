import * as React from "react";
import { Spinner, Select } from "@chakra-ui/react";
import Request from "axios-react";
import axios from "axios";
import {Header} from "../components/header";
import PropTypes from 'prop-types';

class PlayerOptions extends React.Component {
  constructor(props) {
    super(props);
    // https://reactjs.org/docs/typechecking-with-proptypes.html
    this.propTypes = {
      // Emit event to parent 
      // https://www.newmediacampaigns.com/blog/react-bubble-events
      onPlayerChange: PropTypes.func.isRequired,
    }
    
    this.updateSelectedPlayer = this.updateSelectedPlayer.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    
    this.filterOptions = [
      { value: "all", displayName: "All" },
      { value: "ball", displayName: "Balls" },
      { value: "strike", displayName: "Strikes" },
      {
        value: "swinging_strike",
        displayName: "Swinging Strikes"
      },
      { value: "strikeout", displayName: "Strikeouts" },
      { value: "in_play", displayName: "In Play" }
    ];
    this.state = {
      selectedPlayer: props.players[0],
      appliedFilters: ['all'],
      pitchEvents: [],
    };
  }

  renderFilters() {
    return (
      <select value={this.state.appliedFilters}
          placeholder="Select option"
          onChange={this.updateFilters}>
        {this.filterOptions.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.displayName}
            </option>
          );
        })}
      </select>
    );
  }

  renderOptions() {
    return this.props.players.map((player, index) => {
      return (
        <option key={index} value={player}>
          {player}
        </option>
      );
    });
  }

  updateSelectedPlayer(event) {
    if (!event) {
      return;
    }
    const selectedPlayer = event.target.value;
    console.log("event", selectedPlayer);
    const pitchEvents = this.props.pitchMap.get(selectedPlayer) || [];
    this.setState({ selectedPlayer, pitchEvents });
    this.props.onPlayerChange(selectedPlayer);
    // TODO(kaisers): Update Filters based on selection.
    this.updateFilters(null);
  }

  updateFilters(filters) {
    console.log('selected filters', filters);
    const maybeEvent = filters && filters.target && filters.target.selectedOptions;
    if (maybeEvent) {
      // TODO(kaisers): How to get the full list?
      filters = [filters.target.selectedOptions[0].value];
    }
    if (!filters) {
      filters = this.state.appliedFilters;
    }
    console.log('filters', filters);
    this.setState({ appliedFilters: filters });
    // TODO(kaisers): this.state.selectedPlayer is not set initially
    const pitchEvents =
      this.props.pitchMap.get(this.state.selectedPlayer) || [];
    console.log('pitchEvents %s', this.state.selectedPlayer, pitchEvents);
    if (filters[0] === "all") {
      this.setState({ pitchEvents });
      return;
    }
    this.setState({
      pitchEvents: pitchEvents.filter(p => {
        let found = false;
        for (const filter of filters) {
          if (p.event_type === filter || p.event_result === filter) {
            found = true;
            break;
          }
        }
        return found;
      })
    });
  }

  render() {
    console.log('appliedFilters', this.state.appliedFilters);
    return (
      <div>
        <select
          value={this.state.selectedPlayer}
          placeholder="Select option"
          onChange={this.updateSelectedPlayer}
        >
          {this.renderOptions()}
        </select>
        {this.state.appliedFilters.length > 0 && this.renderFilters()}
      </div>
    );
  }
}

export class PitchView extends React.Component {
  constructor(props) {
    super(props);
    this.title = "Astros";
    this.logoUrl =
      "https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2F117.svg?v=1629180035695";

    this.state = {
      isLoaded: false,
      allPitchEvents: [],
      players: [],
      pitchMap: new Map()
    };
  }

  renderAllPitchEvents(pitches) {
    return pitches.map(item => <li key={item.play_id}>{item.pitch_name}</li>);
  }

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/rd-astros/hiring-resources/master/pitches.json"
      )
      .then(response => {
        const allPitchEvents = response.data.queryResults.row;
        console.log("allPitchEvents", allPitchEvents);

        const players = new Set();
        for (const p of allPitchEvents) {
          players.add(p.pitcher_name);
        }
        const sortedPlayers = Array.from(players.values()).sort(
          (a, b) => "" + a.localeCompare(b)
        );

        const pitchMap = new Map();
        players.forEach((v, k) => {
          const pitcherPitches = allPitchEvents.filter(
            p => p.pitcher_name === v
          );
          pitchMap.set(v, pitcherPitches);
        });
        this.setState({
          allPitchEvents,
          players: sortedPlayers,
          pitchMap,
          isLoaded: true
        });
      });
  }
  
  updatePlayer(player) {
    console.log('event from child', player);
  }

  render() {
    // TODO(kaisers): Add pitch list component to list pitches when it changes
    return (
      <>
        <PlayerOptions
          players={this.state.players || []}
          pitchMap={this.state.pitchMap}
          onPlayerChange={this.updatePlayer}
        />
        <div>
          {!this.state.isLoaded && <Spinner />}
          {this.state.isLoaded && (
            <ul>{this.renderAllPitchEvents(this.state.allPitchEvents)}</ul>
          )}
        </div>
      </>
    );
  }
}
