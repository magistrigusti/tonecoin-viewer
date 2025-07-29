// src/services/tonApiClient.ts
import { TonApi } from '@ton-api/client';
import type { TokenInfo, TokenPrice, TokenHistory } from '../types/ton';

export class TonApiClientService {
  private client: TonApi;

  constructor(apiKey: string) {
    this.client = new TonApi({
      apiKey: apiKey
    });
  }

  // Получение информации о токене
  async getTokenInfo(address: string): Promise<TokenInfo> {
    try {
      console.log(`Fetching token info for: ${address}`);
      
      // Получаем информацию о Jetton
      const jettonInfo = await this.client.jettons.getJettonInfo({
        account: address
      });

      console.log('Jetton info:', jettonInfo);

      return {
        address: address,
        symbol: jettonInfo.metadata?.symbol || 'UNKNOWN',
        name: jettonInfo.metadata?.name || 'Unknown Token',
        decimals: jettonInfo.metadata?.decimals || 9,
        totalSupply: jettonInfo.totalSupply || '0',
        owner: jettonInfo.owner || 'Unknown'
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      
      // Возвращаем базовую информацию если API недоступен
      return {
        address: address,
        symbol: 'TOKEN',
        name: 'Unknown Token',
        decimals: 9,
        totalSupply: '0',
        owner: 'Unknown'
      };
    }
  }

  // Получение цены токена (симуляция, так как TON API не предоставляет цены)
  async getTokenPrice(tokenAddress: string): Promise<TokenPrice> {
    try {
      // TON API не предоставляет данные о ценах, поэтому симулируем
      const mockPrice = Math.random() * 0.1 + 0.001;
      const mockChange = (Math.random() - 0.5) * 20;
      
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

  // Получение баланса кошелька
  async getWalletBalance(address: string): Promise<string> {
    try {
      const account = await this.client.accounts.getAccount({
        account: address
      });
      
      return account.balance || '0';
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return '0';
    }
  }

  // Получение токенов кошелька
  async getWalletTokens(address: string): Promise<TokenInfo[]> {
    try {
      const jettons = await this.client.accounts.getAccountJettons({
        account: address
      });

      return jettons.jettons.map(jetton => ({
        address: jetton.account,
        symbol: jetton.metadata?.symbol || 'UNKNOWN',
        name: jetton.metadata?.name || 'Unknown Token',
        decimals: jetton.metadata?.decimals || 9,
        totalSupply: jetton.totalSupply || '0',
        owner: jetton.owner || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching wallet tokens:', error);
      return [];
    }
  }
}

export const tonApiClientService = new TonApiClientService(
  process.env.VITE_TON_API_KEY || ''
);