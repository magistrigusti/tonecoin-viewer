// src/types/coinGecko.ts
export type CurrentPriceData = {
  usd: number;
  rub: number;
  changeUsd: number;
  changeRub: number;
};

export type HistoryData = {
  prices: number[];
  volumes: number[];
  dates: string[];
};