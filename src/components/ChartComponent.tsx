// src/components/ChartComponent.tsx
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
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export type Timeframe = '24h' | '7d' | '30d' | '90d' | '1y';

export type ChartProps = {
  prices: number[];
  volumes: number[];
  dates: string[];
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
};

const ChartComponent = ({ 
  prices, 
  volumes, 
  dates, 
  timeframe,
  onTimeframeChange 
}: ChartProps) => {
  const data: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Цена (USD)',
        data: prices,
        borderColor: '#0088cc',
        backgroundColor: 'rgba(0, 136, 204, 0.1)',
        yAxisID: 'y',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: timeframe === '24h' ? 3 : 0
      },
      {
        label: 'Объём (млн)',
        data: volumes.map(v => v / 1_000_000),
        borderColor: '#ff6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y1',
        tension: 0.1,
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit: 10
        }
      },
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

  return (
    <div className="chart-container">
      <div className="timeframe-selector">
        {(['24h', '7d', '30d', '90d', '1y'] as Timeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={timeframe === tf ? 'active' : ''}
          >
            {tf}
          </button>
        ))}
      </div>
      
      <div className="chart-wrapper">
        <Line 
          data={data} 
          options={options}
          height={400}
        />
      </div>
    </div>
  );
};

export default ChartComponent;