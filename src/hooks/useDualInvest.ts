import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useCallback } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { parseBalance } from 'utils/parseAmount'
import { useDualInvestContract } from './useContract'

export function useDualInvestBalance(token?: Token) {
  const contract = useDualInvestContract()
  const { account } = useActiveWeb3React()
  const args = useMemo(() => [token?.address ?? '', account ?? undefined], [account, token])
  const balanceRes = useSingleCallResult(token ? contract : null, 'balances', args)

  return useMemo(() => {
    return token && balanceRes?.result ? parseBalance(balanceRes.result?.[0].toString(), token) : '-'
  }, [balanceRes.result, token])
}

export function useDualInvestCallback(): {
  depositCallback: undefined | ((val: string, tokenAddress: string, options?: any) => Promise<any>)
  withdrawCallback: undefined | (() => Promise<any>)
  createOrderCallback:
    | undefined
    | ((orderId: string | number, productId: string, amount: string, currencyAddress: string) => Promise<any>)
} {
  const contract = useDualInvestContract()

  const deposit = useCallback(
    (val, tokenAddress, options?): Promise<any> => {
      return contract?.deposit(val, tokenAddress, options)
    },
    [contract]
  )
  const withdraw = useCallback((): Promise<any> => contract?.withdraw(), [contract])

  const createOrder = useCallback(
    async (orderId, productId, amount, currencyAddress): Promise<any> => {
      if (!contract) return undefined
      console.log(orderId, productId, amount, currencyAddress)
      const estimatedGas = await contract.estimateGas
        .createOrder(orderId, productId, amount, currencyAddress)
        .catch((error: Error) => {
          console.debug('Failed to create order', error)
          throw error
        })
      console.log(orderId, productId, amount, currencyAddress)
      return contract?.createOrder(orderId, productId, amount, currencyAddress, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
    },
    [contract]
  )

  const res = useMemo(() => {
    return {
      depositCallback: deposit,
      withdrawCallback: withdraw,
      createOrderCallback: createOrder
    }
  }, [createOrder, deposit, withdraw])

  return res
}
