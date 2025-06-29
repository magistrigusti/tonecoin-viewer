// src/App.tsx
import { useEffect, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import PriceCard from './components/PriceCard';
import { useTonPrice, type Timeframe } from './hooks/useTonPrice';
import './App.css';
import type { CurrentPriceData, HistoryData } from './types/coinGecko';

function App() {
  const { fetchCurrentPrice, fetchHistory } = useTonPrice();
  const [currentData, setCurrentData] = useState<CurrentPriceData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [current, history] = await Promise.all([
          fetchCurrentPrice(),
          fetchHistory(timeframe)
        ]);
        setCurrentData(current);
        setHistoryData(history);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  if (isLoading || !currentData || !historyData) {
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
        timeframe={timeframe}
        onTimeframeChange={(tf) => setTimeframe(tf)}
      />
    </div>
  );
}

export default App;