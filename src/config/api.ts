// src/config/api.ts
export const API_CONFIG = {
  // TON Center API ключ (получить на https://toncenter.com/)
  TON_CENTER_API_KEY: process.env.VITE_TON_CENTER_API_KEY || '',
  
  // DeDust API (пока не требует ключа)
  DEDUST_API_BASE: 'https://api.dedust.io/v2',
  
  // TON Center API
  TON_CENTER_API_BASE: 'https://toncenter.com/api/v2',
  
  // Настройки запросов
  REQUEST_TIMEOUT: 10000, // 10 секунд
  
  // Интервал обновления данных
  REFRESH_INTERVAL: 30000, // 30 секунд
};

// Проверка наличия API ключа
export const hasApiKey = (): boolean => {
  return !!API_CONFIG.TON_CENTER_API_KEY;
};

// Получение API ключа с предупреждением
export const getApiKey = (): string => {
  if (!API_CONFIG.TON_CENTER_API_KEY) {
    console.warn('TON Center API ключ не настроен. Некоторые функции могут быть ограничены.');
  }
  return API_CONFIG.TON_CENTER_API_KEY;
};