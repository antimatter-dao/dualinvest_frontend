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

export function useRecurBalance(
  token?: Token
): { autoBalance: string; autoLockedBalance: string; autoBalanceRaw: string } {
  const contract = useDualInvestContract()
  const { account } = useActiveWeb3React()
  const args = useMemo(() => [token?.address ?? '', account ?? undefined], [account, token])

  const autoBalanceRes = useSingleCallResult(token ? contract : null, 'autoBalances', args)
  const autoLockedBalanceRes = useSingleCallResult(token ? contract : null, 'autoBalances_lock', args)

  return useMemo(() => {
    return {
      autoBalanceRaw: autoBalanceRes?.result?.[0].toString() ?? '0',
      autoBalance: token && autoBalanceRes?.result ? parseBalance(autoBalanceRes.result?.[0].toString(), token) : '-',
      autoLockedBalance:
        token && autoLockedBalanceRes?.result ? parseBalance(autoLockedBalanceRes.result?.[0].toString(), token) : '-'
    }
  }, [autoBalanceRes.result, autoLockedBalanceRes.result, token])
}

export function useRecurCallback(): {
  investCallback: undefined | ((val: string, curAddress: string) => Promise<any>)
  redeemCallback: undefined | ((val: string, curAddress: string) => Promise<any>)
} {
  const contract = useDualInvestContract()

  const invest = useCallback(
    async (val, curAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.autoDeposit(val, curAddress).catch((error: Error) => {
        console.debug('Failed to invest', error)
        throw error
      })
      return contract?.autoDeposit(val, curAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const redeem = useCallback(
    async (val, curAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.autoWithdraw(val, curAddress).catch((error: Error) => {
        console.debug('Failed to redeem', error)
        throw error
      })
      return contract?.autoWithdraw(val, curAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )

  return useMemo(() => {
    return {
      investCallback: invest,
      redeemCallback: redeem
    }
  }, [redeem, invest])
}
