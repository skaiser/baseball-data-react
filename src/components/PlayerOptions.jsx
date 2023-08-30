import * as React from "react";
import { Select } from "@chakra-ui/react";
import PropTypes from "prop-types";

const Option = ({ player }) => {
  return <option value={player}>{player}</option>;
};

export const PlayerOptions = (props) => {
  const [selectedPlayer, setSelectedPlayer] = React.useState("");

  const updateSelectedPlayer = (event) => {
    if (!event) {
      return;
    }
    const player = event.target.value;
    setSelectedPlayer(player);
    props.onPlayerChange(player);
  };

  return (
    <Select
      className="PlayerOptions"
      variant="outline"
      size="lg"
      placeholder="Select a pitcher"
      onChange={updateSelectedPlayer}
    >
      {props.players.map((player) => (
        <Option key={player} player={player} />
      ))}
    </Select>
  );
};

// https://reactjs.org/docs/typechecking-with-proptypes.html
PlayerOptions.propTypes = {
  // Emit event to parent
  // https://www.newmediacampaigns.com/blog/react-bubble-events
  onPlayerChange: PropTypes.func.isRequired,
};
