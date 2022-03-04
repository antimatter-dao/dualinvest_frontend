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
      totalBnbDeposit: string
      totalDeposit: string
    }
  | undefined

export function useDualStatistics(): DualStatisticsType {
  const BTCPrice = usePrice(CURRENCIES.BTC.symbol, 600000)
  const ETHPrice = usePrice(CURRENCIES.ETH.symbol, 600000)
  const BNBPrice = usePrice(CURRENCIES.BNB.symbol, 600000)

  const [statistics, setStatistics] = useState<DualStatisticsType>(undefined)

  const promistFn = useCallback(() => Axios.get('getDashboard'), [])
  const callbackFn = useCallback(r => {
    setStatistics(r.data.data)
  }, [])

  usePollingWithMaxRetries(promistFn, callbackFn, 600000)

  const result = useMemo(() => {
    if (!statistics) return undefined
    const totalDeposit =
      statistics && BTCPrice && ETHPrice && BNBPrice
        ? toLocaleNumberString(
            +statistics.totalBtcDeposit * +BTCPrice +
              +statistics.totalEthDeposit * +ETHPrice +
              +statistics.totalBnbDeposit * +BNBPrice +
              +statistics.totalUsdtDeposit,
            0
          )
        : '-'
    return { ...statistics, totalDeposit }
  }, [BNBPrice, BTCPrice, ETHPrice, statistics])

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
  const [dualStatistics, setDualStatistics] = useState<DualStatisticsType>(undefined)

  const BTCPrice = usePrice(CURRENCIES.BTC.symbol, 600000)
  const ETHPrice = usePrice(CURRENCIES.ETH.symbol, 600000)
  const BNBPrice = usePrice(CURRENCIES.ETH.symbol, 600000)
  const recurStatistics = useRecurStatistics()

  const promiseFn = useCallback(() => {
    return Axios.get('getDashboard')
  }, [])
  const callbackFn = useCallback(r => {
    if (r.data.data) {
      setDualStatistics(r.data.data)
    }
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 600000)

  const res = useMemo(() => {
    const totalInvest =
      dualStatistics && recurStatistics && ETHPrice && BTCPrice && BNBPrice
        ? toLocaleNumberString(
            +dualStatistics.totalBtcDeposit * +BTCPrice +
              +dualStatistics.totalEthDeposit * +ETHPrice +
              +dualStatistics.totalBnbDeposit * +BNBPrice +
              +dualStatistics.totalUsdtDeposit,
            0
          )
        : '-'
    const totalProgress =
      dualStatistics && recurStatistics && ETHPrice && BTCPrice && BNBPrice
        ? toLocaleNumberString(+dualStatistics.totalInvestAmount + +recurStatistics.totalReInvest, 0)
        : '-'
    return { totalInvest, totalProgress }
  }, [BNBPrice, BTCPrice, ETHPrice, dualStatistics, recurStatistics])

  return res
}
