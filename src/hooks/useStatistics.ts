import { useCallback, useState, useMemo } from 'react'
import { Axios } from 'utils/axios'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { usePrice } from './usePriceSet'
import { CURRENCIES } from 'constants/currencies'

type DualStatisticsType =
  | {
      totalBtcDeposit: string
      totalInvestAmount: string
      totalUsdtDeposit: string
      totalEthDeposit: string
      totalDeposit: string
    }
  | undefined

export function useDualStatistics(): DualStatisticsType {
  const BTCPrice = usePrice(CURRENCIES.BTC.symbol, 600000)
  const ETHPrice = usePrice(CURRENCIES.ETH.symbol, 600000)

  const [statistics, setStatistics] = useState<DualStatisticsType>(undefined)

  const promistFn = useCallback(() => Axios.get('getDashboard'), [])
  const callbackFn = useCallback(r => {
    setStatistics(r.data.data)
  }, [])

  usePollingWithMaxRetries(promistFn, callbackFn, 600000)

  const result = useMemo(() => {
    if (!statistics) return undefined
    const totalDeposit =
      statistics && BTCPrice && ETHPrice
        ? toLocaleNumberString(
            +statistics.totalBtcDeposit * +BTCPrice +
              +statistics.totalEthDeposit * +ETHPrice +
              +statistics.totalUsdtDeposit,
            0
          )
        : '-'
    return { ...statistics, totalDeposit }
  }, [BTCPrice, ETHPrice, statistics])

  return result
}

export function useRecurStatistics() {
  const [statistics, setStatistics] = useState<{ totalProgress: string; totalReInvest: string } | undefined>(undefined)

  const promiseFn = useCallback(() => {
    return Axios.get('getReinDashboard')
  }, [])

  const callbackFn = useCallback(r => {
    if (r.data.data) {
      setStatistics(r.data.data)
    }
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 600000)

  return statistics
}

export function useHomeStatistics(): { totalInvest: string; totalProgress: string } {
  const [dualStatistics, setdualStatistics] = useState<{ totalProgress: string; totalReInvest: string } | undefined>(
    undefined
  )

  const recurStatistics = useRecurStatistics()

  const promiseFn = useCallback(() => {
    return Axios.get('getReinDashboard')
  }, [])

  const callbackFn = useCallback(r => {
    if (r.data.data) {
      setdualStatistics(r.data.data)
    }
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 600000)

  const res = useMemo(() => {
    const totalInvest =
      dualStatistics && recurStatistics
        ? toLocaleNumberString(+dualStatistics.totalReInvest + +recurStatistics.totalReInvest, 0)
        : '-'
    const totalProgress =
      dualStatistics && recurStatistics
        ? toLocaleNumberString(+dualStatistics.totalProgress + +recurStatistics.totalProgress, 0)
        : '-'
    return { totalInvest, totalProgress }
  }, [dualStatistics, recurStatistics])

  return res
}
