import React from 'react';
import { render } from 'react-dom';
import { Line } from 'react-chartjs-2';

const data = {
  labels: [
    '01/06/2024',
    '02/06/2024',
    '03/06/2024',
    '04/06/2024',
    '05/06/2024',
    '06/06/2024',
    '07/06/2024',
  ],
  datasets: [
    {
      label: 'TBNB',
      data: [0.1, 1, 0.5, 0.8, 1.6, 2, 2.5],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      color: 'white',
    },
  ],
};

const options = {
  maintainAspectRatio: false, // Allow custom aspect ratio
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      ticks: {
        color: 'white', // X-axis values color
      },
      title: {
        display: true,
        text: 'Date',
        color: 'white', // X-axis label color
      },
    },
    y: {
      ticks: {
        color: 'white', // Y-axis values color
      },
      title: {
        display: true,
        text: 'Value',
        color: 'white', // Y-axis label color
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'white', // Legend label color
      },
    },
    tooltip: {
      mode: 'index',
      intersect: true,
    },
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 62,
          yMax: 62,
          borderColor: 'rgb(255, 192, 192)',
          borderWidth: 4,
        },
      },
    },
  },
};

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  background: '#1d1d1d',
  color: 'white',
  padding: 20,
  height: '500px', // Adjust the height for the chart container
  width: '100%', // Adjust the height for the chart container
};

export const LineChart = () => (
  <div style={styles}>
    <Line data={data} options={options} />
  </div>
);
