import { useCallback, useMemo } from 'react'
import { ChainId } from 'constants/chain'
import { useDefiVaultContract } from './useContract'
import { DEFAULT_COIN_SYMBOL } from 'constants/currencies'
// import { useActiveWeb3React } from 'hooks'
// import JSBI from 'jsbi'

export function useDefiVaultCallback(
  chainId: ChainId | undefined,
  currencySymbol: string | undefined,
  type: 'CALL' | 'PUT' | undefined
) {
  const contract = useDefiVaultContract(chainId, currencySymbol, type)
  // const { account } = useActiveWeb3React()

  const depositETH = useCallback(
    async (val: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      return contract?.depositETH({ value: val })
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
      if (chainId && DEFAULT_COIN_SYMBOL[chainId] === currencySymbol && type === 'CALL') {
        return depositETH(val)
      } else {
        return deposit(val)
      }
    },
    [chainId, currencySymbol, deposit, depositETH, type]
  )

  const instantWithdrawCallback = useCallback(
    async (amount: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.withdrawInstantly(amount).catch((error: Error) => {
        console.debug(`Failed to instantly withdraw token`, error)
        throw error
      })
      return contract?.withdrawInstantly(amount, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const standardWithdrawCallback = useCallback(
    async (amount: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.initiateWithdraw(amount).catch((error: Error) => {
        console.debug(`Failed to initiate standard withdraw`, error)
        throw error
      })
      return contract?.initiateWithdraw(amount, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const standardCompleteCallback = useCallback(async (): Promise<any> => {
    if (!contract) {
      throw Error('no contract')
    }
    try {
      const estimatedGas = await contract.estimateGas.completeWithdraw()
      return contract?.completeWithdraw({ gasLimit: estimatedGas })
    } catch (e) {
      console.debug(`Failed to complete standard withdraw`, e)
    }
  }, [contract])

  return useMemo(
    () => ({
      depositCallback,
      instantWithdrawCallback,
      standardWithdrawCallback,
      standardCompleteCallback
    }),
    [depositCallback, instantWithdrawCallback, standardCompleteCallback, standardWithdrawCallback]
  )
}
