import { useEffect, useState } from 'react'
import PriceCard from './components/PriceCard'
import ChartComponent from './components/ChartComponent'
import './App.css'

function App() {
  const [data, setData] = useState<{
    usd: number
    rub: number
    changeUsd: number
    changeRub: number
  }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd,rub&include_24hr_change=true')
        const json = await res.json()
        setData({
          usd: json['the-open-network'].usd,
          rub: json['the-open-network'].rub,
          changeUsd: json['the-open-network'].usd_24h_change,
          changeRub: json['the-open-network'].rub_24h_change
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!data) return <div className="loading">Loading...</div>

  return (
    <div className="app">
      <h1>TON Coin Price</h1>
      <PriceCard currency="USD" value={data.usd} change={data.changeUsd} />
      <PriceCard currency="RUB" value={data.rub} change={data.changeRub} />
      <ChartComponent />
    </div>
  )
}

export default App