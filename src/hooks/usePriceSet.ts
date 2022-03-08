import { useEffect, useState } from 'react'
import { LineSeriesData } from 'components/Chart'
import { priceFormatter } from 'utils/fetch/price'
import { Time } from 'lightweight-charts'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'

export function usePriceSet(symbol: string | undefined) {
  const [priceSet, setPriceSetList] = useState<LineSeriesData | undefined>(undefined)
  const price = usePrice(symbol)

  useEffect(() => {
    if (!symbol) return
    // const id = setInterval(() => {
    fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=16`, {
      method: 'GET',
      mode: 'cors',
      headers: {}
    })
      .then(r => {
        return r.clone().json()
      })
      .then(json => {
        const formatted = priceFormatter(json)
        setPriceSetList(formatted)
      })
      .catch(e => console.error(e))
    // }, 3000)

    // return () => {
    //   clearInterval(id)
    // }
  }, [symbol])

  useEffect(() => {
    if (price) {
      setPriceSetList(list => {
        if (!list) return list
        list[list.length - 1].time = Date.now() as Time
        list[list.length - 1].value = +price
        return [...list]
      })
    }
  }, [price])

  return priceSet
}

export function usePrice(symbol: string | undefined, delay = 5000) {
  const [price, setPrice] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (!symbol) return undefined
    let isMounted = true
    const call = () => {
      return fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`, {
        method: 'GET',
        mode: 'cors',
        headers: {}
      })
        .then(r => {
          return r.clone().json()
        })
        .then(json => {
          if (isMounted) {
            setPrice(json.price)
          }
        })
        .catch(e => console.error(e))
    }
    call()
    const id = setInterval(call, delay)

    return () => {
      clearInterval(id)
      isMounted = false
    }
  }, [delay, symbol])
  return price
}

export function usePriceForAll() {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    let isMounted = true
    const call = async () => {
      try {
        const r = await Promise.all(
          SUPPORTED_CURRENCY_SYMBOL.map(symbol => {
            return fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`, {
              method: 'GET',
              mode: 'cors',
              headers: {}
            })
          })
        )

        const res = await Promise.all(
          r.map(item => {
            return item.clone().json()
          })
        )
        const priceMap = res.reduce((acc, { price }, idx) => {
          acc[SUPPORTED_CURRENCY_SYMBOL[idx]] = price
          return acc
        }, {})

        if (isMounted) {
          setPrices({ ...priceMap, USDT: 1 })
        }
      } catch (e) {
        console.error(e)
      }
    }
    call()
    const id = setInterval(call, 120000)
    return () => {
      clearInterval(id)
      isMounted = false
    }
  }, [])

  return prices
}
