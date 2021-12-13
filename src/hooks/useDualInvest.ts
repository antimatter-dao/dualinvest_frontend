import { useMemo, useCallback } from 'react'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { Axios } from 'utils/axios'
import { parseBalance } from 'utils/parseAmount'
import { useDualInvestContract } from './useContract'
import { Signature, SignatureRequest, SignatureRequest2 } from 'utils/fetch/signature'
import { retry } from 'utils/retry'

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
  depositCallback: undefined | ((val: string, tokenAddress: string) => Promise<any>)
  withdrawCallback: undefined | ((amount: string, currency: string) => Promise<any>)
  createOrderCallback:
    | undefined
    | ((orderId: string | number, productId: string, amount: string, currencyAddress: string) => Promise<any>)
  finishOrderCallback: undefined | ((orderId: string, productId: string) => Promise<any>)
} {
  const { account, chainId } = useActiveWeb3React()
  const contract = useDualInvestContract()

  const deposit = useCallback(
    async (val, tokenAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.deposit(val, tokenAddress).catch((error: Error) => {
        console.debug('Failed to create order', error)
        throw error
      })
      return contract?.deposit(val, tokenAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )
  const withdraw = useCallback(
    (amount: string, currency: string): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!contract || !account || !chainId) {
            throw Error('withdraw fail')
          }
          const nonce = await contract?.withdrawNonces(account)
          const signRes = await retry(
            () =>
              getWithdrawSignature({
                account: account,
                amount: +amount,
                chainId: chainId,
                currency: currency,
                nonce: nonce.toString()
              }),
            { n: 5, minWait: 5000, maxWait: 5000 }
          ).promise

          if (signRes.status !== 200) {
            throw Error('get signature error')
          }
          const withdrawArgs = [
            amount,
            currency,
            [signRes.data.data.signatory, signRes.data.data.signV, signRes.data.data.signR, signRes.data.data.signS]
          ]
          const estimatedGas = await contract.estimateGas.withdraw(...withdrawArgs).catch((error: Error) => {
            console.debug('Failed to create order', error)
            throw error
          })
          const contractRes = await contract?.withdraw(...withdrawArgs, { gasLimit: estimatedGas })
          resolve(contractRes)
        } catch (e) {
          reject(e)
        }
      })
    },
    [account, chainId, contract]
  )

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
    async (orderId, productId): Promise<any> => {
      if (!contract || !account || !chainId || !orderId) return undefined
      const signRes = await retry(
        () =>
          getFinishOrderSignature({
            account: account,
            chainId: chainId,
            orderId: orderId
          }),
        { n: 5, minWait: 2000, maxWait: 2000 }
      ).promise
      if (!signRes.data.data) {
        throw Error('Cannot get signature')
      }
      console.log(999, signRes)
      const {
        orderId: orderIdR,
        productId: productIdR,
        returnedCurrency,
        returnedAmount,
        fee,
        signatory,
        signV,
        signR,
        signS
      } = signRes.data.data
      const args = [orderIdR, productIdR, returnedCurrency, returnedAmount, fee, [signatory, signV, signR, signS]]
      console.log(args)
      const estimatedGas = await contract.estimateGas.finishOrder(...args).catch((error: Error) => {
        console.debug('Failed to create order', error)
        throw error
      })
      return contract?.finishOrder(...args, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
    },
    [account, chainId, contract]
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

const getWithdrawSignature = (data: SignatureRequest) => Axios.getSignature<Signature>('getWithdrawSign', data)

const getFinishOrderSignature = (data: SignatureRequest2) => Axios.getSignature<any>('getFinishOrderSign', data)
