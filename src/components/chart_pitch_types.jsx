import * as React from "react";
import PropTypes from "prop-types";
import { Pie } from 'react-chartjs-2';

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

export class ChartPitchTypes extends React.Component {
  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
    
    this.state = {
      chartData: [],
      chartOptions: {
        responsive: false,
      },
      numPitches: 0,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps.pitchEvents || []);
  }
  
  updateChart(pitchEvents) {
    pitchEvents = pitchEvents || [];
    // console.log('%c pitchEvents chart', 'background: red; color:white;', pitchEvents);
    const pitchTypeCount = new Map();
    for (const p of pitchEvents) {
      const pitchTypeCounter = pitchTypeCount.get(p.pitch_type) || 0;
      pitchTypeCount.set(p.pitch_type, pitchTypeCounter + 1);
    }
    const data = Array.from(pitchTypeCount.values());
    const numPitches = data.map(((sum) => (value) => (sum += value))(0)).pop();
    const labels = Array.from(pitchTypeCount.keys()).map((k, i) => {
      const percentage = Math.floor((data[i] / numPitches) * 100) || 0;
      return `${k} (${percentage}%)`;
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Pitch Distribution 1',
          data: data,
          backgroundColor: Object.values(CHART_COLORS),
        },
      ],
    };
    this.setState({chartData, numPitches});
  }
  
  render() {
    return (
      <div>
        <h4>Pitch distribution ({this.state.numPitches} pitches)</h4>
        <Pie data={this.state.chartData} options={this.state.chartOptions}></Pie>
      </div>
    );
  }
}

ChartPitchTypes.propTypes = {
  // TODO(kaisers): Add formal PitchEvents type
  pitchEvents: PropTypes.array,
}