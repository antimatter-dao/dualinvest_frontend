import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { Axios } from 'utils/axios'
import { useDualInvestContract } from './useContract'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { CURRENCIES } from 'constants/currencies'
import { NETWORK_CHAIN_ID } from 'constants/chain'

export function useReferral(): {
  invitation: undefined | string
  bindCallback: (address: string) => Promise<any>
  inviteCount: undefined | any
  usdtBalance: string
  btcBalance: string
} {
  const [btcBalance, setBtcBalance] = useState('-')
  const [usdtBalance, setUsdtBalance] = useState('-')
  const { account, chainId } = useActiveWeb3React()
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

  const BtcPromiseFn = useCallback(() => {
    if (!account) return new Promise((resolve, reject) => reject(null))
    return Axios.post(
      'getUserAssets',
      {},
      {
        account,
        chainId,
        currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].BTC.address,
        symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].BTC.symbol
      }
    )
  }, [account, chainId])

  const BtcCallbackFn = useCallback(r => {
    if (r?.data?.data?.balance === undefined) {
      setBtcBalance('0')
    } else {
      setBtcBalance(r.data.data.balance)
    }
  }, [])

  const UsdtPromiseFn = useCallback(() => {
    if (!account) return new Promise((resolve, reject) => reject(null))
    return Axios.post(
      'getUserAssets',
      {},
      {
        account,
        chainId,
        currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.address,
        symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.symbol
      }
    )
  }, [account, chainId])

  const UsdtCallbackFn = useCallback(r => {
    if (r?.data?.data?.balance === undefined) {
      setUsdtBalance('0')
    } else {
      setUsdtBalance(r.data.data.balance)
    }
  }, [])

  usePollingWithMaxRetries(BtcPromiseFn, BtcCallbackFn, 300000)
  usePollingWithMaxRetries(UsdtPromiseFn, UsdtCallbackFn, 300000)

  return useMemo(
    () => ({
      invitation: invitationRes?.result?.[0],
      inviteCount: inviteCountRes?.result?.[0]?.toString(),
      usdtBalance,
      btcBalance,
      bindCallback
    }),
    [bindCallback, btcBalance, invitationRes?.result, inviteCountRes?.result, usdtBalance]
  )
}
