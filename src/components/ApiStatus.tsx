// src/components/ApiStatus.tsx
import React from 'react';
import { hasApiKey } from '../config/api';

const ApiStatus: React.FC = () => {
  const hasKey = hasApiKey();

  return (
    <div className="api-status">
      <div className={`status-indicator ${hasKey ? 'connected' : 'disconnected'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {hasKey ? 'API подключен' : 'API не настроен'}
        </span>
      </div>
      
      {!hasKey && (
        <div className="api-warning">
          <p>
            Для полной функциональности настройте TON Center API ключ в файле .env
          </p>
          <a 
            href="https://toncenter.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            Получить API ключ
          </a>
        </div>
      )}
    </div>
  );
};

export default ApiStatus;