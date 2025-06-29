import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export type ChartProps = {
  prices: number[];
  volumes: number[];
  dates: string[];
};

// components/ChartComponent.tsx
const ChartComponent = ({ prices, volumes, dates }: ChartProps) => {
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Цена (USD)',
        data: prices,
        borderColor: '#0088cc',
        yAxisID: 'y',
      },
      {
        label: 'Объём (млн)',
        data: volumes.map(v => v / 1_000_000),
        borderColor: '#ff6384',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index' },
    scales: {
      y: { type: 'linear', display: true, position: 'left' },
      y1: { type: 'linear', display: true, position: 'right' }
    }
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent