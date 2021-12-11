import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useDualInvestContract } from './useContract'
import { BTC } from 'constants/index'
import { parseBalance } from 'utils/parseAmount'

interface BalanceInfo {
  availableBalance: undefined | string
  lockedBalance: undefined | string
  earned: undefined | string
  totalInvest: undefined | string
}

export function useAccountBalances(): { BTC: BalanceInfo } {
  const { account } = useActiveWeb3React()
  const contract = useDualInvestContract()

  const balanceArgs = useMemo(() => [BTC.address ?? '', account ?? undefined], [account])

  const balanceRes = useSingleCallResult(contract, 'balances', balanceArgs)
  const balanceLockRes = useSingleCallResult(contract, 'balances_lock', balanceArgs)
  const earnedRes = useSingleCallResult(contract, 'earned', balanceArgs)

  return useMemo(() => {
    const aBalance = balanceRes?.result?.[0]
    const lBalance = balanceLockRes?.result?.[0]
    const e = earnedRes?.result?.[0]
    return {
      BTC: {
        availableBalance: aBalance ? parseBalance(aBalance, BTC) : undefined,
        lockedBalance: lBalance ? parseBalance(lBalance, BTC) : undefined,
        totalInvest:
          aBalance && lBalance ? +parseBalance(aBalance, BTC) + +parseBalance(lBalance, BTC) + '' : undefined,
        earned: e ? parseBalance(e, BTC) : undefined
      }
    }
  }, [balanceLockRes?.result, balanceRes?.result, earnedRes?.result])
}
