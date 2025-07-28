// src/hooks/useTonToken.ts
import { useState, useEffect, useCallback } from 'react';
import { tonApiService } from '../services/tonApi';
import type { TokenInfo, TokenPrice, TokenHistory } from '../types/ton';

export type Timeframe = '24h' | '7d' | '30d' | '90d' | '1y';

export const useTonToken = (tokenAddress: string) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | null>(null);
  const [tokenHistory, setTokenHistory] = useState<TokenHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenInfo = useCallback(async () => {
    try {
      const info = await tonApiService.getTokenInfo(tokenAddress);
      setTokenInfo(info);
    } catch (err) {
      setError('Failed to fetch token info');
      console.error(err);
    }
  }, [tokenAddress]);

  const fetchTokenPrice = useCallback(async () => {
    try {
      const price = await tonApiService.getTokenPrice(tokenAddress);
      setTokenPrice(price);
    } catch (err) {
      setError('Failed to fetch token price');
      console.error(err);
    }
  }, [tokenAddress]);

  const fetchTokenHistory = useCallback(async (timeframe: Timeframe) => {
    try {
      let days: number;
      
      switch(timeframe) {
        case '24h': days = 1; break;
        case '7d': days = 7; break;
        case '30d': days = 30; break;
        case '90d': days = 90; break;
        case '1y': days = 365; break;
        default: days = 30;
      }

      const history = await tonApiService.getTokenHistory(tokenAddress, days);
      setTokenHistory(history);
    } catch (err) {
      setError('Failed to fetch token history');
      console.error(err);
    }
  }, [tokenAddress]);

  const refreshData = useCallback(async (timeframe: Timeframe = '30d') => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTokenInfo(),
        fetchTokenPrice(),
        fetchTokenHistory(timeframe)
      ]);
    } catch (err) {
      setError('Failed to refresh data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokenInfo, fetchTokenPrice, fetchTokenHistory]);

  useEffect(() => {
    if (tokenAddress) {
      refreshData();
    }
  }, [tokenAddress, refreshData]);

  // Автообновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenAddress && !isLoading) {
        fetchTokenPrice();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tokenAddress, isLoading, fetchTokenPrice]);

  return {
    tokenInfo,
    tokenPrice,
    tokenHistory,
    isLoading,
    error,
    refreshData,
    fetchTokenHistory
  };
};