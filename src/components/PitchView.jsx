import * as React from "react";
import { Spinner } from "@chakra-ui/react";
import Request from "axios-react";
import axios from "axios";
import { ChartPitchTypes } from "./ChartPitchTypes";
import { ChartPitchZone } from "./ChartPitchZone";
import { Header } from "./Header";
import { PlayerOptions } from "./PlayerOptions";
import { PitchFilters } from "./PitchFilters";
import css from "../styles/PitchView.module.css";

export const PitchView = () => {
  const [filterOptions, setFilterOptions] = React.useState([
    { value: "all", displayName: "All" },
    { value: "ball", displayName: "Balls" },
    { value: "strike", displayName: "Strikes" },
    { value: "swinging_strike", displayName: "Swinging Strikes" },
    { value: "strikeout", displayName: "Strikeouts" },
    { value: "hit_into_play", displayName: "In Play" },
  ]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [pitchMap, setPitchMap] = React.useState(new Map());
  const [pitchEvents, setPitchEvents] = React.useState([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState("");
  const [selectedPitchFilter, setSelectedPitchFilter] = React.useState(["all"]);

  React.useEffect(() => {
    axios
      .get(
        "https://cdn.glitch.global/1fb57210-43d7-460f-9d98-1340332c092a/pitches.json?v=1693410225510"
      )
      .then((response) => {
        const allPitchEvents = response.data.queryResults.row;
        // console.log("allPitchEvents", allPitchEvents);

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
            (p) => p.pitcher_name === v
          );
          pitchMap.set(v, pitcherPitches);
        });
        setPlayers(sortedPlayers);
        setPitchMap(pitchMap);
        setPitchEvents([]);
        setSelectedPlayer("");
        setIsLoaded(true);
      });
  }, []);

  React.useEffect(() => {
    updatePitchEventsByFilter(selectedPitchFilter);
  }, [selectedPlayer]);

  const updatePlayer = (newSelectedPlayer) => {
    const pitchEvents = pitchMap.get(newSelectedPlayer) || [];
    setSelectedPlayer(newSelectedPlayer);
    setPitchEvents(pitchEvents);
  };

  const updatePitchEventsByFilter = (filters) => {
    setSelectedPitchFilter(filters);
    const pitchEvents = pitchMap.get(selectedPlayer) || [];
    // console.log("all pitchEvents %s", this.state.selectedPlayer, pitchEvents);

    if (filters[0] === "all") {
      setPitchEvents(pitchEvents);
      return;
    }

    setPitchEvents(
      pitchEvents.filter((p) => {
        let found = false;
        for (const filter of filters) {
          if (p.event_type === filter || p.event_result === filter) {
            found = true;
            break;
          }
        }
        return found;
      })
    );
  };

  return (
    <>
      <PlayerOptions
        players={players || []}
        pitchMap={pitchMap}
        onPlayerChange={updatePlayer}
      />
      {selectedPlayer && (
        <PitchFilters
          filterOptions={filterOptions}
          onFiltersChange={updatePitchEventsByFilter}
        />
      )}
      {!isLoaded && <Spinner />}
      {isLoaded && selectedPlayer && (
        <div className={css.charts}>
          <div className={css.ChartPitchTypes}>
            <ChartPitchTypes pitchEvents={pitchEvents} />
          </div>
          <ChartPitchZone pitchEvents={pitchEvents} />
        </div>
      )}
    </>
  );
};
