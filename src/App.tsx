import { useEffect, useState } from 'react';
import { useTonPrice } from './hooks/useTonPrice';
import PriceCard from './components/PriceCard';
import ChartComponent from './components/ChartComponent';
import './App.css';

function App() {
  const [chartData, setChartData] = useState<ChartProps | null>(null);

  useEffect(() => {
    const load = async () => {
      const history = await fetchHistory();
      setChartData(history);
    };
    load();
  }, []);

  return (
    <div className="app">
      {/* ... */}
      {chartData && (
        <ChartComponent 
          prices={chartData.prices} 
          volumes={chartData.volumes} 
          dates={chartData.dates} 
        />
      )}
    </div>
  );
}

export default App;