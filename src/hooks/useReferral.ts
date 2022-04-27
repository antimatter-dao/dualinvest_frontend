import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { Axios } from 'utils/axios'
import { useDualInvestContract } from './useContract'
import { CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { NETWORK_CHAIN_ID, ChainId } from 'constants/chain'

type ReferBalanceType = {
  [key: typeof SUPPORTED_CURRENCY_SYMBOL[ChainId][number]]: string
}

export function useReferral(): {
  invitation: undefined | string
  inviteCount: string
  bindCallback: (address: string) => Promise<any>
  balance: ReferBalanceType
} {
  const [allRes, setAllRes] = useState<any | undefined>(undefined)
  const { account } = useActiveWeb3React()
  const contract = useDualInvestContract()

  const args = useMemo(() => [account ?? undefined], [account])

  const invitationRes = useSingleCallResult(contract, 'invitation', args)
  const inviteCountRes = useSingleCallResult(contract, 'inviteCount', args)

  const bindCallback = useCallback(
    async (inviter: string): Promise<any> => {
      if (!contract) return undefined
      const estimatedGas = await contract.estimateGas.bind(inviter).catch((error: Error) => {
        console.debug('Failed to bind', error)
        throw error
      })
      return contract?.bind(inviter, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
    },
    [contract]
  )

  const allTokenPromiseFn = useCallback(() => {
    return Promise.all(
      ['USDT', 'BTC'].map(symbol =>
        Axios.post('getUserAssets', undefined, {
          account,
          chainId: NETWORK_CHAIN_ID,
          currency: CURRENCIES[NETWORK_CHAIN_ID][symbol]?.address,
          symbol: CURRENCIES[NETWORK_CHAIN_ID][symbol]?.symbol
        })
      )
    )
  }, [account])

  const allTokenCallbackFn = useCallback(r => {
    setAllRes(r)
  }, [])

  const result = useMemo(() => {
    const resultMap = ['USDT', 'BTC'].reduce((acc, symbol, idx) => {
      acc[symbol] = allRes?.[idx]?.data?.data ? allRes[idx].data.data.balance : '-'
      return acc
    }, {} as ReferBalanceType)
    return resultMap
  }, [allRes])

  useEffect(() => {
    let isMounted = true
    allTokenPromiseFn()
      .then(r => {
        r.map((item: any) => {
          if (item.data.code !== 200) {
            throw Error(item.data.msg)
          }
        })
        if (isMounted) {
          allTokenCallbackFn(r)
        }
      })
      .catch(e => {
        console.error(e)
      })
    return () => {
      isMounted = false
    }
  }, [allTokenCallbackFn, allTokenPromiseFn])

  return useMemo(
    () => ({
      invitation: invitationRes?.result?.[0],
      inviteCount: inviteCountRes?.result?.[0]?.toString(),
      balance: result,
      bindCallback
    }),
    [bindCallback, invitationRes?.result, inviteCountRes?.result, result]
  )
}
