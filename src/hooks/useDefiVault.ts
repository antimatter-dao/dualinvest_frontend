import { useMemo, useCallback } from 'react'
import { useDefiVaultContract } from 'hooks/useContract'
import { ChainList } from 'constants/chain'
import { CURRENCIES } from 'constants/currencies'
import { Token } from 'constants/token'

export interface DefiProduct {
  apy: string
  investCurrency: string
  isActive: boolean
  type: string
  expiredAt: number
  productChainId: number | undefined
  currency: string
  strikePrice: string
  currencyToken: Token
  investCurrencyToken: Token
}

export function useDefiVaultCallback() {
  const contract = useDefiVaultContract()
  const depositETH = useCallback(
    async (val: string): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas.depositETH({ value: val }).catch((error: Error) => {
        console.debug(`Failed to deposit coin`, error)
        throw error
      })
      return contract?.depositETH({ value: val, gasLimit: estimatedGas })
    },
    [contract]
  )
  return useMemo(
    () => ({
      depositETH
    }),
    [depositETH]
  )
}

export function useSingleDefiVault(chainName: string, currency: string, type: string) {
  const cur = currency.toUpperCase()
  const productChainId = useMemo(() => {
    return ChainList.find(chain => chain.symbol.toUpperCase() === chainName.toUpperCase())?.id ?? 0
  }, [chainName])

  return {
    productChainId,
    type: type.toUpperCase() === 'CALL' ? 'CALL' : 'PUT',
    currency: CURRENCIES[productChainId as keyof typeof CURRENCIES]?.[cur]?.symbol ?? '',
    currencyToken: CURRENCIES[productChainId as keyof typeof CURRENCIES]?.[cur],
    investCurrencyToken: CURRENCIES[productChainId as keyof typeof CURRENCIES]?.USDT,
    strikePrice: '30000',
    expiredAt: 1000000000000000,
    apy: '100%',
    investCurrency: CURRENCIES[+(productChainId ?? '0') as keyof typeof CURRENCIES]?.USDT?.symbol ?? '',
    orderLimitU: '1000',
    isActive: true
  }
}
