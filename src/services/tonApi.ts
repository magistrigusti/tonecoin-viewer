// src/services/tonApi.ts
import axios from 'axios';
import type { TokenInfo, TokenPrice, TokenHistory, DeDustPool } from '../types/ton';
import { API_CONFIG, getApiKey } from '../config/api';

export class TonApiService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || getApiKey();
  }

  // Получение информации о токене через TON Center API
  async getTokenInfo(address: string): Promise<TokenInfo> {
    try {
      console.log(`Fetching token info for: ${address}`);
      console.log(`Using API key: ${this.apiKey ? 'Set' : 'Not set'}`);
      
      // Проверяем, является ли адрес API ключом
      if (address.length > 50 && !address.startsWith('EQ') && !address.startsWith('UQ')) {
        console.log('Detected API key format, using custom token info');
        return {
          address: address,
          symbol: 'TON_API',
          name: 'TON API Token',
          decimals: 9,
          totalSupply: '1000000000',
          owner: 'API User'
        };
      }
      
      // Используем TON Center API для получения информации о токене
      const response = await axios.get(`${API_CONFIG.TON_CENTER_API_BASE}/getTokenData`, {
        params: {
          address: address,
          api_key: this.apiKey
        },
        timeout: API_CONFIG.REQUEST_TIMEOUT
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.result) {
        return {
          address: response.data.result.address || address,
          symbol: response.data.result.symbol || 'TON_TOKEN',
          name: response.data.result.name || `TON Token (${address.substring(0, 8)}...)`,
          decimals: response.data.result.decimals || 9,
          totalSupply: response.data.result.totalSupply || '1000000000',
          owner: response.data.result.owner || 'Unknown'
        };
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching token info:', error);
      
      // Возвращаем базовую информацию для демонстрации
      return {
        address: address,
        symbol: 'TON_API',
        name: 'TON API Token',
        decimals: 9,
        totalSupply: '1000000000',
        owner: 'API User'
      };
    }
  }

  // Получение цены токена с DeDust (симуляция)
  async getTokenPrice(tokenAddress: string): Promise<TokenPrice> {
    try {
      // Симуляция данных DeDust API
      // В реальном приложении здесь будет запрос к DeDust API
      const mockPrice = Math.random() * 0.1 + 0.001; // Случайная цена от 0.001 до 0.101 TON
      const mockChange = (Math.random() - 0.5) * 20; // Случайное изменение от -10% до +10%
      
      return {
        token: tokenAddress,
        price: mockPrice,
        priceChange24h: mockChange,
        volume24h: Math.random() * 1000000 + 10000,
        liquidity: Math.random() * 5000000 + 50000,
        marketCap: mockPrice * (Math.random() * 10000000 + 1000000)
      };
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  // Получение исторических данных (симуляция)
  async getTokenHistory(tokenAddress: string, days: number = 30): Promise<TokenHistory[]> {
    try {
      const history: TokenHistory[] = [];
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      
      // Генерируем симуляционные исторические данные для токена
      console.log(`Generating history for token: ${tokenAddress}`);
      
      for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * dayMs);
        const basePrice = 0.01 + Math.random() * 0.05;
        const price = basePrice + (Math.random() - 0.5) * 0.01;
        const volume = Math.random() * 1000000 + 10000;
        const liquidity = Math.random() * 5000000 + 50000;
        
        history.push({
          timestamp,
          price,
          volume,
          liquidity
        });
      }
      
      return history;
    } catch (error) {
      console.error('Error fetching token history:', error);
      throw error;
    }
  }

  // Получение всех пулов для токена (симуляция)
  async getTokenPools(tokenAddress: string): Promise<DeDustPool[]> {
    try {
      // Симуляция пулов DeDust
      return [
        {
          address: 'EQD...pool1',
          token0: 'TON',
          token1: tokenAddress,
          reserve0: (Math.random() * 1000000 + 10000).toString(),
          reserve1: (Math.random() * 10000000 + 100000).toString(),
          fee: 0.3,
          volume24h: Math.random() * 1000000 + 10000,
          tvl: Math.random() * 5000000 + 50000
        }
      ];
    } catch (error) {
      console.error('Error fetching token pools:', error);
      throw error;
    }
  }

  // Получение баланса кошелька
  async getWalletBalance(address: string): Promise<string> {
    try {
      const response = await axios.get(`${API_CONFIG.TON_CENTER_API_BASE}/getAddressBalance`, {
        params: {
          address: address,
          api_key: this.apiKey
        },
        timeout: API_CONFIG.REQUEST_TIMEOUT
      });

      return response.data.result;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return '0';
    }
  }

  // Получение токенов кошелька
  async getWalletTokens(address: string): Promise<TokenInfo[]> {
    try {
      const response = await axios.get(`${API_CONFIG.TON_CENTER_API_BASE}/getWalletTokens`, {
        params: {
          address: address,
          api_key: this.apiKey
        },
        timeout: API_CONFIG.REQUEST_TIMEOUT
      });

      return response.data.result.map((token: any) => ({
        address: token.address,
        symbol: token.symbol || 'UNKNOWN',
        name: token.name || 'Unknown Token',
        decimals: token.decimals || 9,
        totalSupply: token.totalSupply || '0',
        owner: token.owner || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching wallet tokens:', error);
      return [];
    }
  }
}

export const tonApiService = new TonApiService();