import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useDualInvestContract } from './useContract'
import { BTC, USDT } from 'constants/index'
import { parseBalance } from 'utils/parseAmount'
import { Token } from 'constants/token'

interface BalanceInfo {
  availableBalance: undefined | string
  lockedBalance: undefined | string
  earned: undefined | string
  totalInvest: undefined | string
}

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
    return {
      availableBalance: aBalance ? parseBalance(aBalance, token) : undefined,
      lockedBalance: lBalance ? parseBalance(lBalance, token) : undefined,
      totalInvest:
        aBalance && lBalance ? +parseBalance(aBalance, token) + +parseBalance(lBalance, token) + '' : undefined,
      earned: e ? parseBalance(e, token) : undefined
    }
  }, [balanceLockRes?.result, balanceRes?.result, earnedRes?.result, token])
}

export function useAccountBalances(): { BTC: BalanceInfo | undefined; USDT: BalanceInfo | undefined } {
  const btcRes = useCurrencyBalances(BTC)
  const usdtRes = useCurrencyBalances(USDT)

  return useMemo(() => {
    return {
      BTC: btcRes,
      USDT: usdtRes
    }
  }, [btcRes, usdtRes])
}
