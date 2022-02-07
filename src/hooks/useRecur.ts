import { useCallback, useMemo } from 'react'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useDualInvestContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { parseBalance } from 'utils/parseAmount'

export function useRecurBalance(
  currency: Token | undefined,
  investCucrrency: Token | undefined
): { autoBalance: string; autoLockedBalance: string; autoBalanceRaw: string } {
  const contract = useDualInvestContract()
  const { account } = useActiveWeb3React()

  const args = useMemo(() => [currency?.address ?? '', investCucrrency?.address ?? '', account ?? undefined], [
    currency?.address,
    investCucrrency?.address,
    account
  ])

  const autoBalanceRes = useSingleCallResult(currency ? contract : null, 'autoBalances', args)
  const autoLockedBalanceRes = useSingleCallResult(currency ? contract : null, 'autoBalances_lock', args)

  return useMemo(() => {
    return {
      autoBalanceRaw: autoBalanceRes?.result?.[0].toString() ?? '0',
      autoBalance:
        investCucrrency && autoBalanceRes?.result
          ? parseBalance(autoBalanceRes.result?.[0].toString(), investCucrrency)
          : '-',
      autoLockedBalance:
        investCucrrency && autoLockedBalanceRes?.result
          ? parseBalance(autoLockedBalanceRes.result?.[0].toString(), investCucrrency)
          : '-'
    }
  }, [autoBalanceRes.result, autoLockedBalanceRes.result, investCucrrency])
}

export function useRecurCallback(): {
  investCallback: undefined | ((val: string, curAddress: string, investCurAddress: string) => Promise<any>)
  redeemCallback: undefined | ((val: string, curAddress: string, investCurAddress: string) => Promise<any>)
} {
  const contract = useDualInvestContract()

  const invest = useCallback(
    async (val, curAddress, investCurAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas
        .autoDeposit(curAddress, val, investCurAddress)
        .catch((error: Error) => {
          console.debug('Failed to invest', error)
          throw error
        })
      return contract?.autoDeposit(curAddress, val, investCurAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const redeem = useCallback(
    async (val, curAddress, investCurAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas
        .autoWithdraw(curAddress, val, investCurAddress)
        .catch((error: Error) => {
          console.debug('Failed to redeem', error)
          throw error
        })
      return contract?.autoWithdraw(curAddress, val, investCurAddress, { gasLimit: estimatedGas })
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
