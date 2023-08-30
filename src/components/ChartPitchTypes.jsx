import * as React from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";

const CHART_COLORS = Object.freeze({
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
});

export const ChartPitchTypes = ({ pitchEvents }) => {
  const [chartData, setChartData] = React.useState([]);
  const [chartOptions, setChartOptions] = React.useState({
    responsive: false,
  });
  const [numPitches, setNumPitches] = React.useState(0);

  React.useEffect(() => {
    updateChart(pitchEvents || []);
  }, [pitchEvents]);

  const updateChart = (pitchEvents) => {
    pitchEvents = pitchEvents || [];
    // console.log('%c pitchEvents chart', 'background: red; color:white;', pitchEvents);
    const pitchTypeCount = new Map();
    for (const p of pitchEvents) {
      const pitchTypeCounter = pitchTypeCount.get(p.pitch_type) || 0;
      pitchTypeCount.set(p.pitch_type, pitchTypeCounter + 1);
    }
    const data = Array.from(pitchTypeCount.values());
    const numPitches = data
      .map(
        (
          (sum) => (value) =>
            (sum += value)
        )(0)
      )
      .pop();
    const labels = Array.from(pitchTypeCount.keys()).map((k, i) => {
      const percentage = Math.floor((data[i] / numPitches) * 100) || 0;
      return `${k} (${percentage}%)`;
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Pitch Distribution 1",
          data: data,
          backgroundColor: Object.values(CHART_COLORS),
        },
      ],
    };
    setChartData(chartData);
    setNumPitches(numPitches);
  };

  return (
    <div>
      <h4>Pitch distribution ({numPitches || 0} pitches)</h4>
      {numPitches && <Pie data={chartData} options={chartOptions}></Pie>}
    </div>
  );
};

ChartPitchTypes.propTypes = {
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array,
};
