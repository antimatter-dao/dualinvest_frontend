import { useMemo, useCallback } from 'react'
import { useDualInvestContract } from './useContract'

export function useDualInvestCallback(): {
  depositCallback: undefined | ((val: string, tokenAddress: string, options?: any) => Promise<any>)
  withdrawCallback: undefined | (() => Promise<any>)
} {
  const contract = useDualInvestContract()

  const deposit = useCallback(
    (val, tokenAddress, options?): Promise<any> => {
      return contract?.deposit(val, tokenAddress, options)
    },
    [contract]
  )
  const withdraw = useCallback((): Promise<any> => contract?.withdraw(), [contract])

  const res = useMemo(() => {
    return {
      depositCallback: deposit,
      withdrawCallback: withdraw
    }
  }, [deposit, withdraw])

  return res
}
