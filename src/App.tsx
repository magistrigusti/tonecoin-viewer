import { useEffect, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import PriceCard from './components/PriceCard';
import { useTonPrice } from './hooks/useTonPrice';
import './App.css';
import type { CurrentPriceData, HistoryData } from './types/coinGecko';

function App() {
  const { fetchCurrentPrice, fetchHistory } = useTonPrice();
  const [currentData, setCurrentData] = useState<CurrentPriceData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [current, history] = await Promise.all([
          fetchCurrentPrice(),
          fetchHistory()
        ]);
        setCurrentData(current);
        setHistoryData(history);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!currentData || !historyData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <h1>TON Coin Price</h1>
      <PriceCard currency="USD" value={currentData.usd} change={currentData.changeUsd} />
      <PriceCard currency="RUB" value={currentData.rub} change={currentData.changeRub} />
      <ChartComponent 
        prices={historyData.prices} 
        volumes={historyData.volumes} 
        dates={historyData.dates} 
      />
    </div>
  );
}

export default App;