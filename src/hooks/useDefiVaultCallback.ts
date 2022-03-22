import { useCallback, useMemo } from 'react'
import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'
import { useDefiVaultContract } from './useContract'

export function useDefiVaultCallback(
  chainId: ChainId | undefined,
  currencySymbol: string | undefined,
  type: 'CALL' | 'PUT' | undefined
) {
  const contract = useDefiVaultContract(chainId, currencySymbol, type)

  const depositETH = useCallback(
    async (val: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      return contract?.depositETH({ value: val, gasLimit: 70000000 })
    },
    [contract]
  )

  const deposit = useCallback(
    async (val: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.deposit(val).catch((error: Error) => {
        console.debug(`Failed to deposit token`, error)
        throw error
      })
      return contract?.deposit(val, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const depositCallback = useCallback(
    (val: string): Promise<any> => {
      if (chainId && SUPPORTED_NETWORKS[chainId].nativeCurrency.symbol === currencySymbol) {
        return depositETH(val)
      } else {
        return deposit(val)
      }
    },
    [chainId, currencySymbol, deposit, depositETH]
  )

  const withdrawCallback = useCallback(async (): Promise<any> => {
    if (!contract) {
      throw Error('no contract')
    }
    const estimatedGas = await contract.estimateGas.withdraw().catch((error: Error) => {
      console.debug(`Failed to deposit token`, error)
      throw error
    })
    return contract?.withdraw({ gasLimit: estimatedGas })
  }, [contract])

  return useMemo(
    () => ({
      depositCallback,
      withdrawCallback
    }),
    [depositCallback, withdrawCallback]
  )
}
