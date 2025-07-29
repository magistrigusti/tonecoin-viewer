// src/App.tsx
import { useState } from 'react';
import TokenCard from './components/TokenCard';
import TokenChart from './components/TokenChart';
import TokenInput from './components/TokenInput';
import ApiStatus from './components/ApiStatus';
import ApiTest from './components/ApiTest';
import { useTonToken, type Timeframe } from './hooks/useTonToken';
import './App.css';

// Пример адреса TON токена (Jetton)
const DEFAULT_TOKEN_ADDRESS = 'EQDk2VTvn04SUKJrW7rXahzdF8_Qi6utb0wj3Fvo5Hnfqs01';

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

  // Отладочная информация
  console.log('App state:', {
    tokenAddress,
    isLoading,
    error,
    tokenInfo,
    tokenPrice,
    historyLength: tokenHistory?.length
  });

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
        <div className="app-header">
          <h1>TON Token Viewer</h1>
          <ApiStatus />
        </div>
        <div className="error">
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => refreshData()}>Попробовать снова</button>
        </div>
        <TokenInput
          onTokenAddressChange={handleTokenAddressChange}
          currentAddress={tokenAddress}
          isLoading={isLoading}
        />
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
          <ApiTest />
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