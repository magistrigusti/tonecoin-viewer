// src/components/TokenChart.tsx
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
import type { TokenHistory } from '../types/ton';
import type { Timeframe } from '../hooks/useTonToken';

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

export type TokenChartProps = {
  history: TokenHistory[];
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  tokenSymbol: string;
};

const TokenChart: React.FC<TokenChartProps> = ({ 
  history, 
  timeframe, 
  onTimeframeChange, 
  tokenSymbol 
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'numeric'
    });
  };

  const data: ChartData<'line'> = {
    labels: history.map(item => formatDate(item.timestamp)),
    datasets: [
      {
        label: `Цена ${tokenSymbol} (TON)`,
        data: history.map(item => item.price),
        borderColor: '#0088cc',
        backgroundColor: 'rgba(0, 136, 204, 0.1)',
        yAxisID: 'y',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: timeframe === '24h' ? 3 : 0
      },
      {
        label: 'Объем (TON)',
        data: history.map(item => item.volume),
        borderColor: '#ff6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y1',
        tension: 0.1,
        borderWidth: 1
      },
      {
        label: 'Ликвидность (TON)',
        data: history.map(item => item.liquidity),
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        yAxisID: 'y2',
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
          text: `Цена ${tokenSymbol} (TON)`,
          color: '#0088cc'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Объем (TON)',
          color: '#ff6384'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y2: {
        type: 'linear',
        display: false,
        position: 'right',
        title: {
          display: true,
          text: 'Ликвидность (TON)',
          color: '#36a2eb'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className="token-chart-container">
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

export default TokenChart;