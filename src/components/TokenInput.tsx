// src/components/TokenInput.tsx
import React, { useState } from 'react';

interface TokenInputProps {
  onTokenAddressChange: (address: string) => void;
  currentAddress: string;
  isLoading?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({ 
  onTokenAddressChange, 
  currentAddress, 
  isLoading = false 
}) => {
  const [inputValue, setInputValue] = useState(currentAddress);
  const [error, setError] = useState<string | null>(null);

  const validateAddress = (address: string): boolean => {
    // Простая валидация TON адреса
    if (!address.trim()) {
      setError('Адрес токена не может быть пустым');
      return false;
    }
    
    if (!address.startsWith('EQ') && !address.startsWith('UQ')) {
      setError('Неверный формат адреса TON');
      return false;
    }
    
    if (address.length < 48) {
      setError('Адрес слишком короткий');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = inputValue.trim();
    
    if (validateAddress(trimmedAddress)) {
      onTokenAddressChange(trimmedAddress);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="token-input-container">
      <form onSubmit={handleSubmit} className="token-input-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Введите адрес токена (например: EQD...)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`token-address-input ${error ? 'error' : ''}`}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="token-input-button"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Обновить'}
          </button>
        </div>
        
        {error && (
          <div className="input-error">
            {error}
          </div>
        )}
        
        <div className="input-help">
          <p>Примеры адресов:</p>
          <ul>
            <li>EQD... - Jetton токен</li>
            <li>UQD... - NFT коллекция</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default TokenInput;