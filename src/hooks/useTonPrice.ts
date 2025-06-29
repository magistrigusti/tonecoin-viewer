// src/hooks/useTonPrice.ts
import axios from 'axios';

type CurrentPriceResponse = {
  'the-open-network': {
    usd: number;
    rub: number;
    usd_24h_change: number;
    rub_24h_change: number;
  };
};

type MarketChartResponse = {
  prices: [number, number][];
  total_volumes: [number, number][];
};

type OHLCResponse = [number, number, number, number, number][]; // [timestamp, open, high, low, close]

export type Timeframe = '24h' | '7d' | '30d' | '90d' | '1y';

export const useTonPrice = () => {
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

  const fetchHistory = async (timeframe: Timeframe) => {
    try {
      let days, interval;
      
      switch(timeframe) {
        case '24h': 
          days = 1;
          interval = 'hourly';
          break;
        case '7d': 
          days = 7;
          interval = 'hourly';
          break;
        case '30d': 
          days = 30;
          interval = 'daily';
          break;
        case '90d': 
          days = 90;
          interval = 'daily';
          break;
        case '1y': 
          days = 365;
          interval = 'daily';
          break;
        default: 
          days = 30;
          interval = 'daily';
      }

      if (timeframe === '24h' || timeframe === '7d') {
        const res = await axios.get<OHLCResponse>(
          `https://api.coingecko.com/api/v3/coins/the-open-network/ohlc?vs_currency=usd&days=${days}`
        );

        return {
          prices: res.data.map(item => item[4]), // Цена закрытия
          volumes: [], // OHLC не возвращает объемы
          dates: res.data.map(item => 
            new Date(item[0]).toLocaleString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'numeric'
            })
          )
        };
      } else {
        const res = await axios.get<MarketChartResponse>(
          `https://api.coingecko.com/api/v3/coins/the-open-network/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
        );

        return {
          prices: res.data.prices.map(([, price]) => price),
          volumes: res.data.total_volumes.map(([, volume]) => volume),
          dates: res.data.prices.map(([timestamp]) => 
            new Date(timestamp).toLocaleString('ru-RU', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })
          )
        };
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  };

  return { fetchCurrentPrice, fetchHistory };
};