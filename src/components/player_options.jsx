import * as React from "react";
import { Select } from "@chakra-ui/react";
import PropTypes from "prop-types";

export class PlayerOptions extends React.Component {
  constructor(props) {
    super(props);
    this.updateSelectedPlayer = this.updateSelectedPlayer.bind(this);
    this.state = {
      selectedPlayer: ""
    };
  }

  renderOptionsList() {
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
    this.setState({ selectedPlayer }, () => {
      this.props.onPlayerChange(this.state.selectedPlayer);
    });
  }

  render() {
    return (
      <Select
        className="PlayerOptions"
        variant="outline"
        size="lg"
        placeholder="Select a pitcher"
        onChange={this.updateSelectedPlayer}
      >
        {this.renderOptionsList()}
      </Select>
    );
  }
}

// https://reactjs.org/docs/typechecking-with-proptypes.html
PlayerOptions.propTypes = {
  // Emit event to parent
  // https://www.newmediacampaigns.com/blog/react-bubble-events
  onPlayerChange: PropTypes.func.isRequired
};
