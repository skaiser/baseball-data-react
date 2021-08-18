import * as React from "react";
import { Spinner, Select } from "@chakra-ui/react";
import Request from "axios-react";

// TODO(kaisers): Figure out how to create a folder in Glitch and put this in components/
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function Header(props) {
  return (
    <div class="header">
      <Welcome name={props.name} />
      <span class="flex-spacer"></span>
      <img class="logo" alt="Logo" src={props.logo} />
    </div>
  );
}

class PlayerOptions extends React.Component {
  render() {
    return (
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    );
  }
}

export default function Home() {
  const name = 'Astros'
  const logoUrl =
    "https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2F117.svg?v=1629180035695";

  
  const allPitchEvents = pitches =>
    pitches.map(item => <li key={item.play_id}>{item.pitch_name}</li>);

  return (
    <>
      <Header name={name} logo={logoUrl} />
      // TODO(kaisers): pass in player list
      <PlayerOptions players={null} />
      <Request
        config={{
          method: "get",
          url:
            "https://raw.githubusercontent.com/rd-astros/hiring-resources/master/pitches.json"
        }}
      >
        {({ loading, response, error, refetch, _networkStatus }) => (
          <div>
            {loading && <Spinner />}
            {error && <span>{error.response.data}</span>}
            {response && (
              <ul>{allPitchEvents(response.data.queryResults.row)}</ul>
            )}
            <button onClick={refetch}>Refetch!</button>
          </div>
        )}
      </Request>
    </>
  );
}
