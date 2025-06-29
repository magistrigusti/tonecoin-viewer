// src/hooks/useTonPrice.ts
import axios from 'axios';

// Типы для ответа API
type CurrentPriceResponse = {
  'the-open-network': {
    usd: number;
    rub: number;
    usd_24h_change: number;
    rub_24h_change: number;
  };
};

type HistoryResponse = {
  prices: [number, number][]; // [timestamp, price]
  total_volumes: [number, number][]; // [timestamp, volume]
};

export const useTonPrice = () => {
  // Текущая цена
  const fetchCurrentPrice = async () => {
    const res = await axios.get<CurrentPriceResponse>(
      'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd,rub&include_24hr_change=true'
    );

    return {
      usd: res.data['the-open-network'].usd,
      rub: res.data['the-open-network'].rub,
      changeUsd: res.data['the-open-network'].usd_24h_change,
      changeRub: res.data['the-open-network'].rub_24h_change,
    };
  };

  // Исторические данные
  const fetchHistory = async () => {
    const res = await axios.get<HistoryResponse>(
      'https://api.coingecko.com/api/v3/coins/the-open-network/market_chart?vs_currency=usd&days=30&interval=daily'
    );

    return {
      prices: res.data.prices.map(([, price]) => price),
      volumes: res.data.total_volumes.map(([, volume]) => volume),
      dates: res.data.prices.map(([timestamp]) => 
        new Date(timestamp).toLocaleDateString('ru-RU')
      ),
    };
  };

  return { fetchCurrentPrice, fetchHistory };
};