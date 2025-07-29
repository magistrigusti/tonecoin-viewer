// src/components/TokenCard.tsx
import React from 'react';
import type { TokenInfo, TokenPrice } from '../types/ton';

interface TokenCardProps {
  tokenInfo: TokenInfo;
  tokenPrice: TokenPrice;
}

const TokenCard: React.FC<TokenCardProps> = ({ tokenInfo, tokenPrice }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(4);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatAddress = (address: string) => {
    if (address.length > 50) {
      return `${address.substring(0, 20)}...${address.substring(address.length - 10)}`;
    }
    return address;
  };

  const isApiToken = tokenInfo.address.length > 50;

  return (
    <div className="token-card">
      <div className="token-header">
        <h2>{tokenInfo.name}</h2>
        <span className={`token-symbol ${isApiToken ? 'api-token' : ''}`}>
          {tokenInfo.symbol}
        </span>
      </div>
      
      <div className="token-price">
        <div className="price-main">
          <span className="price-value">{formatPrice(tokenPrice.price)} TON</span>
          <span className={`price-change ${tokenPrice.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
            {tokenPrice.priceChange24h >= 0 ? '+' : ''}{tokenPrice.priceChange24h.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="token-stats">
        <div className="stat-item">
          <span className="stat-label">Объем 24ч</span>
          <span className="stat-value">{formatNumber(tokenPrice.volume24h)} TON</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Ликвидность</span>
          <span className="stat-value">{formatNumber(tokenPrice.liquidity)} TON</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Рыночная кап</span>
          <span className="stat-value">{formatNumber(tokenPrice.marketCap)} TON</span>
        </div>
      </div>

      <div className="token-info">
        <div className="info-item">
          <span className="info-label">Адрес контракта</span>
          <span className="info-value">{formatAddress(tokenInfo.address)}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Общее предложение</span>
          <span className="info-value">{formatNumber(parseFloat(tokenInfo.totalSupply))}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Дексемы</span>
          <span className="info-value">{tokenInfo.decimals}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;