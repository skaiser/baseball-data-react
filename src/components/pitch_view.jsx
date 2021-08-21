import * as React from "react";
import { Spinner } from "@chakra-ui/react";
import Request from "axios-react";
import axios from "axios";
import { Header } from "../components/header";
import { PlayerOptions } from "../components/player_options";
import { PitchFilters } from "../components/pitch_filters";
import PropTypes from "prop-types";

export class PitchView extends React.Component {
  constructor(props) {
    super(props);

    this.filterOptions = [
      { value: "all", displayName: "All" },
      { value: "ball", displayName: "Balls" },
      { value: "strike", displayName: "Strikes" },
      { value: "swinging_strike", displayName: "Swinging Strikes" },
      { value: "strikeout", displayName: "Strikeouts" },
      { value: "hit_into_play", displayName: "In Play" }
    ];

    this.updatePlayer = this.updatePlayer.bind(this);
    this.updateFilters = this.updateFilters.bind(this);

    this.state = {
      isLoaded: false,
      filterOptions: this.filterOptions,
      players: [],
      pitchMap: new Map()
    };
  }

  renderPitchEvents(pitches) {
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
          players: sortedPlayers,
          pitchMap,
          pitchEvents: [],
          selectedPlayer: "",
          isLoaded: true
        });
      });
  }

  updatePlayer(selectedPlayer) {
    const pitchEvents = this.state.pitchMap.get(selectedPlayer) || [];
    this.setState({ selectedPlayer, pitchEvents }, () => {
      this.renderPitchEvents(pitchEvents);
      this.updateFilters(["all"]);
      console.log("event from child", this.state.selectedPlayer);
    });
  }

  updateFilters(filters) {
    this.setState({ appliedFilters: filters });
    const pitchEvents =
      this.state.pitchMap.get(this.state.selectedPlayer) || [];
    console.log("all pitchEvents %s", this.state.selectedPlayer, pitchEvents);
    
    if (filters[0] === "all") {
      this.setState({ pitchEvents });
      return;
    }
    
    this.setState(
      {
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
      },
      () => {
        this.renderPitchEvents(this.state.pitchEvents);
      }
    );
  }

  render() {
    return (
      <>
        <PlayerOptions
          players={this.state.players || []}
          pitchMap={this.state.pitchMap}
          onPlayerChange={this.updatePlayer}
        />
        {this.state.selectedPlayer && (
          <PitchFilters
            filterOptions={this.state.filterOptions}
            onFiltersChange={this.updateFilters}
          />
        )}
        {!this.state.isLoaded && <Spinner />}
        {this.state.isLoaded &&
         <div>
            {this.state.selectedPlayer && 
              <p>Pitch count: {this.state.pitchEvents.length || 0}</p>
            }
            {
            <ul>{this.renderPitchEvents(this.state.pitchEvents)}</ul>
            }
        </div>}
      </>
    );
  }
}
