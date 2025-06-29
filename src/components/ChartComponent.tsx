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

const ChartComponent: React.FC = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'TON Price (USD)',
        data: [2.5, 2.7, 2.8, 2.6, 2.9, 2.85],
        borderColor: '#0088cc',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="chart-container">
      <Line data={data} />
    </div>
  )
}

export default ChartComponent