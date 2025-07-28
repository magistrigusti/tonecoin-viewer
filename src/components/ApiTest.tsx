// src/components/ApiTest.tsx
import React, { useState } from 'react';
import { tonApiService } from '../services/tonApi';
import { hasApiKey, getApiKey } from '../config/api';

const ApiTest: React.FC = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  const testApi = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);

    try {
      console.log('Testing TON API...');
      console.log('API Key configured:', hasApiKey());
      console.log('API Key:', getApiKey() ? 'Present' : 'Missing');

      // Тестируем с простым запросом
      const testAddress = 'EQDk2VTvn04SUKJrW7rXahzdF8_Qi6utb0wj3Fvo5Hnfqs01';
      const result = await tonApiService.getTokenInfo(testAddress);
      
      setApiTestResult(`✅ API работает! Токен: ${result.symbol} (${result.name})`);
    } catch (error) {
      console.error('API Test failed:', error);
      setApiTestResult(`❌ Ошибка API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="api-test">
      <div className="api-test-header">
        <h3>🔧 Тест API</h3>
        <button 
          onClick={testApi} 
          disabled={isTestingApi}
          className="test-button"
        >
          {isTestingApi ? 'Тестирование...' : 'Тестировать API'}
        </button>
      </div>
      
      {apiTestResult && (
        <div className={`test-result ${apiTestResult.includes('✅') ? 'success' : 'error'}`}>
          {apiTestResult}
        </div>
      )}
      
      <div className="api-info">
        <p><strong>API Key:</strong> {hasApiKey() ? '✅ Настроен' : '❌ Не настроен'}</p>
        <p><strong>Статус:</strong> {hasApiKey() ? 'Готов к использованию' : 'Работает в демо-режиме'}</p>
      </div>
    </div>
  );
};

export default ApiTest;