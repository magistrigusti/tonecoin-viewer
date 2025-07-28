// src/types/ton.ts
export type TokenInfo = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  owner: string;
};

export type PoolInfo = {
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  fee: number;
  address: string;
};

export type TokenPrice = {
  token: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
};

export type TokenHistory = {
  timestamp: number;
  price: number;
  volume: number;
  liquidity: number;
};

export type WalletInfo = {
  address: string;
  balance: string;
  tokens: TokenBalance[];
};

export type TokenBalance = {
  token: TokenInfo;
  balance: string;
  value: number;
};

export type DeDustPool = {
  address: string;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  fee: number;
  volume24h: number;
  tvl: number;
};