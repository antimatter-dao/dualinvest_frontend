import { useEffect, useState } from 'react'
import { LineSeriesData } from 'components/Chart'
import { priceFormatter } from 'utils/fetch/price'

export function usePriceSet(symbol: string | undefined) {
  const [priceSet, setPriceSetList] = useState<LineSeriesData | undefined>(undefined)
  const price = usePrice(symbol)

  useEffect(() => {
    if (!symbol) return
    // const id = setInterval(() => {
    fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=12`, {
      method: 'GET',
      mode: 'cors',
      headers: {}
    })
      .then(r => {
        return r.clone().json()
      })
      .then(json => {
        const formatted = priceFormatter(json)
        if (price) {
          formatted[formatted.length - 1].value = +price
        }
        setPriceSetList(formatted)
      })
      .catch(e => console.error(e))
    // }, 3000)

    // return () => {
    //   clearInterval(id)
    // }
  }, [price, symbol])
  return priceSet
}

export function usePrice(symbol: string | undefined) {
  const [price, setPrice] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (!symbol) return undefined
    const id = setInterval(() => {
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`, {
        method: 'GET',
        mode: 'cors',
        headers: {}
      })
        .then(r => {
          return r.clone().json()
        })
        .then(json => {
          setPrice(json.price)
        })
        .catch(e => console.error(e))
    }, 3000)

    return () => {
      clearInterval(id)
    }
  }, [symbol])
  return price
}
