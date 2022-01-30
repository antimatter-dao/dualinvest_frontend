import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useDualInvestContract } from './useContract'
import { parseBalance } from 'utils/parseAmount'
import { Token } from 'constants/token'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { Axios } from 'utils/axios'
import { assetBalanceFormatter, BalanceInfo } from 'utils/fetch/balance'
import { CURRENCIES } from 'constants/currencies'

export function useCurrencyBalances(token: Token): BalanceInfo | undefined {
  const { account } = useActiveWeb3React()
  const contract = useDualInvestContract()

  const balanceArgs = useMemo(() => [token.address ?? '', account ?? undefined], [account, token.address])

  const balanceRes = useSingleCallResult(contract, 'balances', balanceArgs)
  const balanceLockRes = useSingleCallResult(contract, 'balances_lock', balanceArgs)
  const earnedRes = useSingleCallResult(contract, 'earned', balanceArgs)

  return useMemo(() => {
    const aBalance = balanceRes?.result?.[0]
    const lBalance = balanceLockRes?.result?.[0]
    const e = earnedRes?.result?.[0]
    if (!aBalance || !lBalance || !e) return undefined

    const res = {
      available: aBalance ? parseBalance(aBalance, token) : undefined,
      locked: lBalance ? parseBalance(lBalance, token) : undefined,
      totalInvest:
        aBalance && lBalance ? +parseBalance(aBalance, token) + +parseBalance(lBalance, token) + '' : undefined,
      pnl: e ? parseBalance(e, token) : undefined
    }

    return res
  }, [balanceLockRes?.result, balanceRes?.result, earnedRes?.result, token])
}

// export function useAccountBalances(): { BTC: BalanceInfo | undefined; USDT: BalanceInfo | undefined } {
//   const btcRes = useCurrencyBalances(BTC)
//   const usdtRes = useCurrencyBalances(USDT)

//   return useMemo(() => {
//     return {
//       BTC: btcRes,
//       USDT: usdtRes
//     }
//   }, [btcRes, usdtRes])
// }

export function useAccountBalances(): {
  BTC: BalanceInfo | undefined
  USDT: BalanceInfo | undefined
  ETH: BalanceInfo | undefined
} {
  const [btcRes, setBtcRes] = useState<BalanceInfo | undefined>(undefined)
  const [usdtRes, setUsdtRes] = useState<BalanceInfo | undefined>(undefined)
  const [ethRes, setEthRes] = useState<BalanceInfo | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()

  const btcPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.BTC.address,
        symbol: CURRENCIES.BTC.symbol
      }),
    [account, chainId]
  )
  const btcCallbackFn = useCallback(r => {
    setBtcRes(assetBalanceFormatter(r.data.data))
  }, [])
  const usdtPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.USDT.address,
        symbol: CURRENCIES.USDT.symbol
      }),
    [account, chainId]
  )
  const usdtCallbackFn = useCallback(r => setUsdtRes(assetBalanceFormatter(r.data.data)), [])

  const ethPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.ETH.address,
        symbol: CURRENCIES.ETH.symbol
      }),
    [account, chainId]
  )
  const ethCallbackFn = useCallback(r => {
    setEthRes(assetBalanceFormatter(r.data.data))
  }, [])

  usePollingWithMaxRetries(btcPromiseFn, btcCallbackFn, 300000)
  usePollingWithMaxRetries(usdtPromiseFn, usdtCallbackFn, 300000)
  usePollingWithMaxRetries(ethPromiseFn, ethCallbackFn, 30000)

  return useMemo(() => {
    return {
      BTC: btcRes,
      ETH: ethRes,
      USDT: usdtRes
    }
  }, [btcRes, usdtRes, ethRes])
}
