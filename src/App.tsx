import { useEffect, useState } from 'react';
import PriceCard from './components/PriceCard';
import ChartComponent from './components/ChartComponent';

function App() {
  const [data, setData] = useState<{
    usd: number, changeUsd: number
  }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd,rub&include_24hr_change=true');
        const json = await res.json();
        setData({
          usd: json['the-open-network'].usd,
          changeUsd: json['the-open-network']
        })
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">Loading...</div>
}