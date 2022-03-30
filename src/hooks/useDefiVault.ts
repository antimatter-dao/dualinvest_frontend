import { useMemo, useState, useEffect } from 'react'
import { Contract } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import JSBI from 'jsbi'
import { ChainId, ChainList, NETWORK_CHAIN_ID } from 'constants/chain'
import { CURRENCIES, SUPPORTED_CURRENCIES, SUPPORTED_DEFI_VAULT } from 'constants/currencies'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'
import { getContract, isAddress } from 'utils'
import { DEFI_VAULT_ADDRESS, ZERO_ADDRESS } from 'constants/index'
import DEFI_VAULT_ABI from '../constants/abis/defi_vault.json'
import DEFI_VAULT_OPTION_ABI from '../constants/abis/defi_vault_option.json'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { parseBalance } from 'utils/parseAmount'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useDefiVaultContract } from './useContract'
import { trimNumberString } from 'utils/trimNumberString'

export interface DefiProduct {
  apy: string
  type: 'CALL' | 'PUT'
  expiredAt: number
  strikePrice: string
  currency: string
  investCurrency: string
  chainId: ChainId | undefined
  balance?: string
  instantBalance?: string
  completeBalance?: string
  initiateBalance?: string
}

enum DefiProductDataOrder {
  accountVaultBalance
  // currentOption
}

const APY = '100%'

export function useSingleDefiVault(chainName: string, currency: string, type: string): DefiProduct | null {
  const { account } = useActiveWeb3React()
  const [strikePrice, setStrikePrice] = useState<any>(undefined)
  const args = useMemo(() => {
    return [account ?? undefined]
  }, [account])

  const cur = currency.toUpperCase()
  const productChainId: number = useMemo(() => {
    return ChainList.find(chain => chain.symbol.toUpperCase() === chainName.toUpperCase())?.id ?? NETWORK_CHAIN_ID
  }, [chainName])

  const contract = useDefiVaultContract(productChainId, cur, type === 'CALL' ? 'CALL' : 'PUT')
  const instantBalance = useSingleCallResult(contract, 'depositReceipts', args)
  const initiateBalance = useSingleCallResult(contract, 'accountVaultBalance', args)
  const withdrawals = useSingleCallResult(contract, 'withdrawals', args)
  const optionAddress = useSingleCallResult(contract, 'currentOption')

  const argPrice = useMemo(() => {
    return [withdrawals?.result?.round]
  }, [withdrawals?.result?.round])
  const price = useSingleCallResult(contract, 'roundPricePerShare', argPrice)

  useEffect(() => {
    if (!optionAddress.result?.[0]) return
    ;(async () => {
      const price = await getStrikePrice(optionAddress.result?.[0], getOtherNetworkLibrary(+productChainId))
      setStrikePrice(price)
    })()
  }, [optionAddress.result, productChainId])

  const result = useMemo(() => {
    if (!SUPPORTED_DEFI_VAULT[productChainId as keyof typeof SUPPORTED_DEFI_VAULT]?.includes(cur)) {
      return null
    } else {
      const investCurrency = type.toUpperCase() === 'CALL' ? SUPPORTED_CURRENCIES[cur]?.symbol ?? '' : 'USDC'
      const token = CURRENCIES[productChainId as ChainId][investCurrency]
      const shares = withdrawals.result?.shares?.toString()
      const priceResult = price.result?.[0]?.toString()
      const instantBalanceDisabled = withdrawals.result?.round === initiateBalance.result?.round
      const val =
        shares && priceResult
          ? JSBI.divide(
              JSBI.multiply(JSBI.BigInt(shares), JSBI.BigInt(priceResult)),
              JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(10))
            )
          : undefined

      return {
        chainId: productChainId,
        type: type.toUpperCase() === 'CALL' ? 'CALL' : 'PUT',
        currency: SUPPORTED_CURRENCIES[cur]?.symbol ?? '',
        investCurrency: investCurrency,
        instantBalance:
          instantBalance.result?.amount && productChainId
            ? parseBalance(instantBalanceDisabled ? '0' : instantBalance.result?.amount, token)
            : '-',
        completeBalance: val ? parseBalance(val.toString(), token) : '-',
        initiateBalance:
          initiateBalance.result?.[0] && productChainId ? parseBalance(initiateBalance.result[0], token) : '-',
        strikePrice: strikePrice,
        expiredAt: getExpireAt(),
        apy: APY
      } as DefiProduct
    }
  }, [
    cur,
    initiateBalance.result,
    instantBalance.result?.amount,
    price?.result,
    productChainId,
    strikePrice,
    type,
    withdrawals.result
  ])
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
      const addresses = DEFI_VAULT_ADDRESS[+chainId as ChainId]
      const list = SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.reduce(
        (acc, symbol: string) => {
          const addressCall = addresses?.[symbol]?.CALL
          const addressPut = addresses?.[symbol]?.PUT
          const contractCall = addressCall && library ? getContract(addressCall, DEFI_VAULT_ABI, library) : null
          const contractPut = addressPut && library ? getContract(addressPut, DEFI_VAULT_ABI, library) : null
          acc.push(callsFactory(contractCall, account))
          acc.push(callsFactory(contractPut, account))
          return acc
        },
        [] as any[]
      )
      acc.push(list ? Promise.all(list) : undefined)
      return acc
    }, [] as any[])
    setPromise(Promise.all(list))
  }, [account])

  useEffect(() => {
    ;(async () => {
      if (!promise) setDefiVaultList(defiVaultListUtil())
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

// defi list vault calls
const callsFactory = (contract: Contract | null, account: string | null | undefined) => {
  return Promise.all([account ? contract?.accountVaultBalance(account) : null])
}

const defiVaultListUtil = (res?: any[][]) => {
  return Object.keys(SUPPORTED_DEFI_VAULT).reduce((accMain, chainId: string, idx1: number) => {
    SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.map((symbol: string, idx2: number) => {
      accMain.push({
        chainId: +chainId,
        currency: symbol,
        balance:
          res && res[idx1][idx2 * 2][DefiProductDataOrder.accountVaultBalance]
            ? trimNumberString(
                parseBalance(
                  res[idx1][idx2][DefiProductDataOrder.accountVaultBalance].toString(),
                  CURRENCIES[+chainId as ChainId][symbol]
                ),
                4
              )
            : '-',
        type: 'CALL',
        apy: APY,
        expiredAt: getExpireAt(),
        investCurrency: symbol,
        strikePrice: '-'
      })
      accMain.push({
        chainId: +chainId,
        currency: symbol,
        balance:
          res && res[idx1][idx2 * 2 + 1][DefiProductDataOrder.accountVaultBalance]
            ? trimNumberString(
                parseBalance(
                  res[idx1][idx2][DefiProductDataOrder.accountVaultBalance].toString(),
                  CURRENCIES[+chainId as ChainId]['USDC']
                ),
                4
              )
            : '-',
        type: 'PUT',
        apy: APY,
        expiredAt: getExpireAt(),
        investCurrency: 'USDC',
        strikePrice: '-'
      })
    })

    return accMain
  }, [] as DefiProduct[])
}

const getStrikePrice = async (contractAddress: string | undefined, library: Web3Provider | undefined) => {
  if (!contractAddress || !library || !isAddress(contractAddress) || contractAddress === ZERO_ADDRESS) return '-'
  try {
    const contract = getContract(contractAddress, DEFI_VAULT_OPTION_ABI, library)
    const price = await contract?.strikePrice()
    const decimals = await contract?.decimals()
    return JSBI.divide(
      JSBI.BigInt(price.toString()),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ).toString()
  } catch (e) {
    console.error(e)
    return '-'
  }
}

const getExpireAt = () => {
  const now = new Date(Date.now())
  const UTCh = now.getUTCHours()
  const displacement = (5 + 7 - now.getUTCDay()) % 7
  const fridayDate = now.getUTCDate() + (displacement === 0 && UTCh >= 8 ? 7 : displacement)
  now.setUTCDate(fridayDate)
  now.setUTCHours(8, 0, 0)
  return now.getTime()
}
