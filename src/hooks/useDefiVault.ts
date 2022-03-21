import { useMemo, useCallback, useState, useEffect } from 'react'
import { useDefiVaultContract } from 'hooks/useContract'
import { ChainId, ChainList, NETWORK_CHAIN_ID } from 'constants/chain'
import { CURRENCIES, SUPPORTED_DEFI_VAULT } from 'constants/currencies'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'
import { getContract } from 'utils'
import { DEFI_VAULT_ADDRESS } from 'constants/index'
import DEFI_VAULT_ABI from '../constants/abis/defi_vault.json'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { parseBalance } from 'utils/parseAmount'

export interface DefiProduct {
  apy: string
  type: string
  expiredAt: number
  strikePrice: string
  currency: string
  investCurrency: string
  chainId: ChainId | undefined
  balance?: string
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
  const productChainId: number = useMemo(() => {
    return ChainList.find(chain => chain.symbol.toUpperCase() === chainName.toUpperCase())?.id ?? NETWORK_CHAIN_ID
  }, [chainName])

  const result = useMemo(() => {
    if (!SUPPORTED_DEFI_VAULT[productChainId as keyof typeof SUPPORTED_DEFI_VAULT]?.includes(currency.toUpperCase())) {
      return null
    } else {
      return {
        chainId: productChainId,
        type: type.toUpperCase() === 'CALL' ? 'CALL' : 'PUT',
        currency: CURRENCIES[productChainId as keyof typeof CURRENCIES]?.[cur]?.symbol ?? '',
        investCurrency:
          type.toUpperCase() === 'CALL'
            ? CURRENCIES[productChainId as keyof typeof CURRENCIES]?.[cur]?.symbol ?? ''
            : 'USDT',
        strikePrice: '30000',
        expiredAt: 1000000000000000,
        apy: '100%',
        orderLimitU: '1000'
      }
    }
  }, [cur, currency, productChainId, type])
  return result
}

export function useDefiVaultList() {
  const { account } = useActiveWeb3React()
  const [promise, setPromise] = useState<Promise<any> | undefined>(undefined)
  const [defiVaultList, setDefiVaultList] = useState<undefined | null | DefiProduct[]>(undefined)
  const blockNumber = useBlockNumber()
  useEffect(() => {
    const list = Object.keys(SUPPORTED_DEFI_VAULT).reduce((acc, chainId: string) => {
      const library = getOtherNetworkLibrary(+chainId)
      const address = DEFI_VAULT_ADDRESS[+chainId as ChainId]
      const contract = address && library ? getContract(address, DEFI_VAULT_ABI, library) : null
      const list = SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.reduce((
        acc /*, symbol: string*/
      ) => {
        acc.push(Promise.all([contract?.balanceOf(account), contract?.owner()]))
        acc.push(Promise.all([contract?.balanceOf(account), contract?.owner()]))
        return acc
      }, [] as any[])

      acc.push(list ? Promise.all(list) : undefined)
      return acc
    }, [] as any[])
    setPromise(Promise.all(list))
  }, [account])

  useEffect(() => {
    if (!promise) setDefiVaultList(defiVaultListUtil())
    ;(async () => {
      try {
        const res = await promise
        const mappedRes = defiVaultListUtil(res)
        setDefiVaultList(mappedRes)
      } catch (e) {
        console.error(e)
        setDefiVaultList(null)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise, blockNumber])

  return defiVaultList
}

// { apy: string; investCurrency: Token; expiredAt: number; currency: Token }

const defiVaultListUtil = (res?: any[][]) => {
  return Object.keys(SUPPORTED_DEFI_VAULT).reduce((accMain, chainId: string, idx1: number) => {
    SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.map((symbol: string, idx2: number) => {
      console.log(CURRENCIES, CURRENCIES[+chainId as ChainId], chainId)
      accMain.push({
        chainId: +chainId,
        currency: symbol,
        balance:
          res && res[idx1][idx2][0]
            ? parseBalance(res[idx1][idx2][0].toString(), CURRENCIES[+chainId as ChainId][symbol])
            : '-',
        type: 'CALL',
        apy: '100%',
        expiredAt: 23847234987,
        investCurrency: symbol,
        strikePrice: '1000'
      })
      accMain.push({
        chainId: +chainId,
        currency: symbol,
        balance:
          res && res[idx1][idx2][0]
            ? parseBalance(res[idx1][idx2][0].toString(), CURRENCIES[+chainId as ChainId]['USDT'])
            : '-',
        type: 'PUT',
        apy: '100%',
        expiredAt: 23847234987,
        investCurrency: 'USDT',
        strikePrice: '1000'
      })
    })
    return accMain
  }, [] as DefiProduct[])
}
