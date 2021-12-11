import { useMemo, useCallback } from 'react'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { Axios } from 'utils/axios'
import { parseBalance } from 'utils/parseAmount'
import { useDualInvestContract } from './useContract'
import { Signature } from 'utils/fetch/signature'

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
  withdrawCallback: undefined | ((amount: string, currency: string) => Promise<any>)
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
  const withdraw = useCallback((): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        // const signRes = await getSignature(1)
        const contractRes = await contract?.withdraw()
        resolve(contractRes)
      } catch (e) {
        reject(e)
      }
    })
  }, [contract])

  const createOrder = useCallback(
    async (orderId, productId, amount, currencyAddress): Promise<any> => {
      if (!contract) return undefined
      const estimatedGas = await contract.estimateGas
        .createOrder(orderId, productId, amount, currencyAddress)
        .catch((error: Error) => {
          console.debug('Failed to create order', error)
          throw error
        })
      return contract?.createOrder(orderId, productId, amount, currencyAddress, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
    },
    [contract]
  )

  const finishOrder = useCallback(
    async (orderId, productId, amount, currencyAddress): Promise<any> => {
      if (!contract) return undefined
      const estimatedGas = await contract.estimateGas
        .finishOrder(orderId, productId, amount, currencyAddress)
        .catch((error: Error) => {
          console.debug('Failed to create order', error)
          throw error
        })
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
      createOrderCallback: createOrder,
      finishOrderCallback: finishOrder
    }
  }, [createOrder, deposit, finishOrder, withdraw])

  return res
}

export function getSignature(signatureCount: 1 | 3 = 1): Promise<any> {
  const signRoutes = [
    'https://node1.chainswap.com/web/getNftRecvSignData',
    'https://node2.chainswap.com/web/getNftRecvSignData',
    'https://node3.chainswap.com/web/getNftRecvSignData',
    'https://node4.chainswap.com/web/getNftRecvSignData',
    'https://node5.chainswap.com/web/getNftRecvSignData'
  ]

  const httpRequestsList = signRoutes.map(route => Axios.post<Signature>(route, {}))

  const aggregated: Signature[] = []
  let error = 0
  const requestList: Promise<Signature[]> = new Promise((resolve, reject) => {
    httpRequestsList.map(promise => {
      promise
        .then(r => {
          if (r?.data?.code !== 200) return
          aggregated.push(r.data.data)
          if (aggregated.length >= signatureCount) {
            resolve(aggregated.slice(0, signatureCount))
          }
        })
        .catch(() => {
          if (error > signRoutes.length - signatureCount) {
            reject('signature request fail')
          } else {
            error++
          }
        })
    })
  })

  return requestList
}
