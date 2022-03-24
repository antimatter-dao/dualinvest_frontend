import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { Axios } from 'utils/axios'
import { assetBalanceFormatter, BalanceInfo } from 'utils/fetch/balance'
import { CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { ChainId, NETWORK_CHAIN_ID } from 'constants/chain'
import { trimNumberString } from 'utils/trimNumberString'

type AccountBalanceType = {
  [key: typeof SUPPORTED_CURRENCY_SYMBOL[ChainId][number]]: BalanceInfo | undefined
}

export function useAccountBalances(): AccountBalanceType {
  const [usdtRes, setUsdtRes] = useState<BalanceInfo | undefined>(undefined)
  const [allRes, setAllRes] = useState<any | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()

  const allTokenPromiseFn = useCallback(() => {
    return Promise.all(
      SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].map(symbol =>
        Axios.post('getUserAssets', undefined, {
          account,
          chainId: chainId ?? NETWORK_CHAIN_ID,
          currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]?.address,
          symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]?.symbol
        })
      )
    )
  }, [account, chainId])

  const usdtPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId: chainId ?? NETWORK_CHAIN_ID,
        currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.address,
        symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.symbol
      }),
    [account, chainId]
  )
  const usdtCallbackFn = useCallback(r => {
    setUsdtRes(assetBalanceFormatter(r.data.data))
  }, [])

  const allTokenCallbackFn = useCallback(r => {
    setAllRes(r)
  }, [])

  usePollingWithMaxRetries(usdtPromiseFn, usdtCallbackFn, 300000)
  usePollingWithMaxRetries(allTokenPromiseFn, allTokenCallbackFn, 300000, 5, true)

  const usdtResult: BalanceInfo | undefined = useMemo(() => {
    return usdtRes
      ? {
          ...usdtRes,
          totalInvest: usdtRes.totalInvest ? trimNumberString(usdtRes.totalInvest, 4) : '-'
        }
      : undefined
  }, [usdtRes])

  const result = useMemo(() => {
    const resultMap = SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].reduce((acc, symbol, idx) => {
      const res = allRes?.[idx]?.data?.data?.Available ? assetBalanceFormatter(allRes[idx].data.data) : undefined
      acc[symbol] = res
        ? {
            ...res,
            totalInvest: res.totalInvest ? trimNumberString(res.totalInvest, 4) : '-'
          }
        : undefined
      return acc
    }, {} as AccountBalanceType)
    resultMap.USDT = usdtResult
    return resultMap
  }, [allRes, chainId, usdtResult])

  return result
}
