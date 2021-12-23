import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { calculateGasMargin } from 'utils'
import { useDualInvestContract } from './useContract'

export function useReferral(): { invitation: undefined | string; bindCallback: (address: string) => Promise<any> } {
  const { account } = useActiveWeb3React()
  const contract = useDualInvestContract()
  const args = useMemo(() => [account ?? undefined], [account])

  const invitationRes = useSingleCallResult(contract, 'invitation', args)

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

  return useMemo(
    () => ({
      invitation: invitationRes?.result?.[0],
      bindCallback
    }),
    [bindCallback, invitationRes?.result]
  )
}
