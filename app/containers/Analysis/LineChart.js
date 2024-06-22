import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  background: '#1d1d1d',
  color: 'white',
  padding: 20,
  height: '500px',
  width: '100%',
};

export const LineChart = ({ chartData }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'TBNB',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        color: 'white',
      },
    ],
  });

  // Cập nhật dữ liệu biểu đồ khi chartData thay đổi
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const labels = chartData.map((item) => item.name);
      const dataValues = chartData.map((item) => item.value);

      setData({
        labels: labels,
        datasets: [
          {
            label: 'TBNB',
            data: dataValues,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            color: 'white',
          },
        ],
      });
    }
  }, [chartData]); // Phụ thuộc vào chartData để cập nhật lại data khi chartData thay đổi

  // Tính toán giá trị max cho trục y
  const maxYValue = Math.max(...chartData.map((item) => item.value));

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: 'white',
        },
        title: {
          display: true,
          text: 'Date',
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        title: {
          display: true,
          text: 'Value',
          color: 'white',
        },
        max: maxYValue, // Thiết lập giá trị max cho trục y
      },
      yAxes: [
        {
          ticks: {
            max: maxYValue,
          },
        },
      ],
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: true,
      },
      datalabels: {
        display: true,
        color: 'white',
        align: 'top',
        formatter: (value) => value.toFixed(5),
        font: {
          weight: 'bold',
          size: 12,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 3,
      },
    },
  };

  return (
    <div style={styles}>
      {/* Đảm bảo rằng 'key' được truyền vào để reset component khi chartData thay đổi */}
      <Line
        key={JSON.stringify(chartData)}
        data={data}
        options={options}
        plugins={[ChartDataLabels]}
      />
    </div>
  );
};

export default LineChart;
