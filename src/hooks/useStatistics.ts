import { useCallback, useState, useMemo } from 'react'
import { Axios } from 'utils/axios'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { usePriceForAll } from './usePriceSet'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'

type DualStatisticsType =
  | {
      [key: string]: string
      totalDeposit: string
      totalInvestAmount: string
    }
  | undefined

function replaceAll(str: string, match: string, replace: string) {
  return str.replace(new RegExp(match, 'g'), () => replace)
}

export function useDualStatistics(): DualStatisticsType {
  const indexPrices = usePriceForAll()
  const [statistics, setStatistics] = useState<DualStatisticsType>(undefined)
  const { chainId } = useActiveWeb3React()

  const promistFn = useCallback(() => Axios.get('getDashboard', { chainId: NETWORK_CHAIN_ID }), [])

  const callbackFn = useCallback(r => {
    setStatistics(r.data.data)
  }, [])

  usePollingWithMaxRetries(promistFn, callbackFn, 600000)

  const result = useMemo(() => {
    if (!statistics) return undefined

    const totalDeposit = indexPrices
      ? toLocaleNumberString(
          SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].reduce((acc: number, symbol: string) => {
            acc +=
              +(
                statistics[`total${symbol[0] + symbol.slice(1).toLowerCase()}Deposit` as keyof typeof statistics] ?? 0
              ) * +(indexPrices[symbol as keyof typeof indexPrices] ?? 0)
            return acc
          }, 0) + +statistics.totalUsdtDeposit,
          0
        )
      : '-'

    return { ...statistics, totalDeposit }
  }, [chainId, indexPrices, statistics])

  return result
}

export function useRecurStatistics() {
  const [statistics, setStatistics] = useState<{ totalProgress: string; totalReInvest: string } | undefined>(undefined)
  const { chainId } = useActiveWeb3React()

  const promiseFn = useCallback(() => {
    return Axios.get('getReinDashboard', { chainId: chainId ?? NETWORK_CHAIN_ID })
  }, [chainId])

  const callbackFn = useCallback(r => {
    if (r.data.data) {
      setStatistics(r.data.data)
    }
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 600000)

  return statistics
}

export function useHomeStatistics(): { totalInvest: string; totalProgress: string } {
  const dualStatistics = useDualStatistics()
  const recurStatistics = useRecurStatistics()

  const res = useMemo(() => {
    const totalInvest =
      dualStatistics?.totalDeposit && recurStatistics?.totalReInvest
        ? toLocaleNumberString(+replaceAll(dualStatistics.totalDeposit, ',', '') + +recurStatistics.totalReInvest, 0)
        : '-'

    const totalProgress =
      dualStatistics?.totalInvestAmount && recurStatistics?.totalProgress
        ? toLocaleNumberString(+dualStatistics.totalInvestAmount + +recurStatistics.totalProgress, 0)
        : '-'
    return { totalInvest, totalProgress }
  }, [dualStatistics, recurStatistics])

  return res
}
