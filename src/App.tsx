// src/App.tsx
import { useState, useEffect } from 'react';
import TokenCard from './components/TokenCard';
import TokenChart from './components/TokenChart';
import TokenInput from './components/TokenInput';
import ApiStatus from './components/ApiStatus';
import { useTonToken, type Timeframe } from './hooks/useTonToken';
import './App.css';

// Адрес вашего токена - замените на реальный адрес
const DEFAULT_TOKEN_ADDRESS = 'AHPIGD2RQOJXJYYAAAADP4KWHNUCY2LSOZBYXM273NBPEA4KOATYZRFCYWF6VK65FYL44VI'; // Ваш токен

function App() {
  const [tokenAddress, setTokenAddress] = useState(DEFAULT_TOKEN_ADDRESS);
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  
  const {
    tokenInfo,
    tokenPrice,
    tokenHistory,
    isLoading,
    error,
    refreshData,
    fetchTokenHistory
  } = useTonToken(tokenAddress);

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
    fetchTokenHistory(newTimeframe);
  };

  const handleTokenAddressChange = (address: string) => {
    if (address.trim()) {
      setTokenAddress(address.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка данных токена...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => refreshData()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  if (!tokenInfo || !tokenPrice) {
    return (
      <div className="app">
        <div className="welcome">
          <h1>TON Token Viewer</h1>
          <p>Введите адрес токена для начала работы</p>
          <ApiStatus />
          <TokenInput
            onTokenAddressChange={handleTokenAddressChange}
            currentAddress={tokenAddress}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>TON Token Viewer</h1>
        <ApiStatus />
        <TokenInput
          onTokenAddressChange={handleTokenAddressChange}
          currentAddress={tokenAddress}
          isLoading={isLoading}
        />
      </div>

      <TokenCard tokenInfo={tokenInfo} tokenPrice={tokenPrice} />
      
      {tokenHistory.length > 0 && (
        <TokenChart
          history={tokenHistory}
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          tokenSymbol={tokenInfo.symbol}
        />
      )}

      <div className="app-footer">
        <p>Данные обновляются каждые 30 секунд</p>
        <p>Источник: DeDust.io API</p>
      </div>
    </div>
  );
}

export default App;