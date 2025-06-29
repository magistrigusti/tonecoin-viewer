import React from 'react'

interface PriceCardProps {
  currency: 'USD' | 'RUB'
  value: number
  change: number
}

const PriceCard: React.FC<PriceCardProps> = ({ currency, value, change }) => {
  return (
    <div className="price-card">
      <h2>
        {currency}: {currency === 'USD' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}₽`}
      </h2>
      <p className={change >= 0 ? 'up' : 'down'}>
        24h: {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </p>
    </div>
  )
}

export default PriceCard