import { useCallback, useMemo } from 'react'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { Axios } from 'utils/axios'
import { useDualInvestContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { parseBalance } from 'utils/parseAmount'

export function useToggleCompound() {
  const toggleCompound = useCallback(() => {
    Axios.get
  }, [])
  return toggleCompound
}

export function useRecurBalance(token?: Token): { autoBalance: string; autoLockedBalance: string } {
  const contract = useDualInvestContract()
  const { account } = useActiveWeb3React()
  const args = useMemo(() => [token?.address ?? '', account ?? undefined], [account, token])

  const autoBalanceRes = useSingleCallResult(token ? contract : null, 'autoBalances', args)
  const autoLockedBalanceRes = useSingleCallResult(token ? contract : null, 'autoBalances_lock', args)

  return useMemo(() => {
    return {
      autoBalance: token && autoBalanceRes?.result ? parseBalance(autoBalanceRes.result?.[0].toString(), token) : '-',
      autoLockedBalance:
        token && autoLockedBalanceRes?.result ? parseBalance(autoLockedBalanceRes.result?.[0].toString(), token) : '-'
    }
  }, [autoBalanceRes.result, autoLockedBalanceRes.result, token])
}
