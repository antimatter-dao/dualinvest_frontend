import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useDualInvestContract } from './useContract'
import { BTC, USDT } from 'constants/index'
import { parseBalance } from 'utils/parseAmount'
import { Token } from 'constants/token'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { Axios } from 'utils/axios'
import { assetBalanceFormatter, BalanceInfo } from 'utils/fetch/balance'

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

export function useAccountBalances(): { BTC: BalanceInfo | undefined; USDT: BalanceInfo | undefined } {
  const [btcRes, setBtcRes] = useState<BalanceInfo | undefined>(undefined)
  const [usdtRes, setUsdtRes] = useState<BalanceInfo | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()

  const btcPromiseFn = useCallback(
    () => Axios.post('getUserAssets', undefined, { account, chainId, currency: BTC.address, symbol: BTC.symbol }),
    [account, chainId]
  )
  const btcCallbackFn = useCallback(r => {
    setBtcRes(assetBalanceFormatter(r.data.data))
  }, [])
  const usdtPromiseFn = useCallback(
    () => Axios.post('getUserAssets', undefined, { account, chainId, currency: USDT.address, symbol: USDT.symbol }),
    [account, chainId]
  )
  const usdtCallbackFn = useCallback(r => setUsdtRes(assetBalanceFormatter(r.data.data)), [])

  usePollingWithMaxRetries(btcPromiseFn, btcCallbackFn, 30000)
  usePollingWithMaxRetries(usdtPromiseFn, usdtCallbackFn, 30000)

  return useMemo(() => {
    return {
      BTC: btcRes,
      USDT: usdtRes
    }
  }, [btcRes, usdtRes])
}
