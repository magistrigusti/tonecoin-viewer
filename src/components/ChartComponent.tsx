import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type ChartProps = {
  prices: number[];
  volumes: number[];
  dates: string[];
};

const ChartComponent = ({ prices, volumes, dates }: ChartProps) => {
  const data: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Цена (USD)',
        data: prices,
        borderColor: '#0088cc',
        yAxisID: 'y',
        tension: 0.1
      },
      {
        label: 'Объём (млн)',
        data: volumes.map(v => v / 1_000_000),
        borderColor: '#ff6384',
        yAxisID: 'y1',
        tension: 0.1
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Цена (USD)',
          color: '#0088cc'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Объём (млн)',
          color: '#ff6384'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;