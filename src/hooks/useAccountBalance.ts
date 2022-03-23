import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { Axios } from 'utils/axios'
import { assetBalanceFormatter, BalanceInfo } from 'utils/fetch/balance'
import { CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { ChainId, NETWORK_CHAIN_ID } from 'constants/chain'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { useDualInvestContract } from './useContract'
import { trimNumberString } from 'utils/trimNumberString'
import { parseBalance } from 'utils/parseAmount'
import { Token } from 'constants/token'
import { ZERO_ADDRESS } from 'constants/index'

type AccountBalanceType = {
  [key: typeof SUPPORTED_CURRENCY_SYMBOL[ChainId][number]]: BalanceInfo | undefined
}

const getRecurTotal = (balanceLocked: string, balanceAvailable: string) => {
  if (balanceLocked === '-' || balanceAvailable === '-') {
    return '-'
  }
  return trimNumberString((+balanceLocked + +balanceAvailable).toFixed(4), 4)
}

const formatRecur = (available: any, locked: any, token: Token) => {
  const recurAvailable = available ? trimNumberString(parseBalance(available.toString(), token, 18), 6) : '-'
  const recurLocked = locked ? trimNumberString(parseBalance(locked.toString(), token, 18), 6) : '-'

  return {
    recurAvailable,
    recurLocked
  }
}

export function useAccountBalances(): AccountBalanceType {
  const [usdtRes, setUsdtRes] = useState<BalanceInfo | undefined>(undefined)
  const [allRes, setAllRes] = useState<any | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()
  const contract = useDualInvestContract()

  const args = useMemo(() => {
    const CUR = CURRENCIES[NETWORK_CHAIN_ID]
    return SUPPORTED_CURRENCY_SYMBOL[NETWORK_CHAIN_ID].map(key => {
      return [CUR[key]?.address ?? '', CUR[key]?.address ?? '', account ?? ZERO_ADDRESS]
    })
  }, [account])

  const argsUsdt = useMemo(() => {
    const CUR = CURRENCIES[NETWORK_CHAIN_ID]
    return SUPPORTED_CURRENCY_SYMBOL[NETWORK_CHAIN_ID].map(key => {
      return [CUR[key]?.address ?? '', CUR.USDT?.address ?? '', account ?? ZERO_ADDRESS]
    })
  }, [account])

  const recurBalanceRes = useSingleContractMultipleData(contract, 'autoBalances', args)
  const recurLockedBalanceRes = useSingleContractMultipleData(contract, 'autoBalances_lock', args)
  const recurUsdtBalanceRes = useSingleContractMultipleData(contract, 'autoBalances', argsUsdt)
  const recurUsdtLockedBalanceRes = useSingleContractMultipleData(contract, 'autoBalances_lock', argsUsdt)

  const allTokenPromiseFn = useCallback(() => {
    return Promise.all(
      SUPPORTED_CURRENCY_SYMBOL[NETWORK_CHAIN_ID].map(symbol =>
        Axios.post('getUserAssets', undefined, {
          account,
          chainId: chainId ?? NETWORK_CHAIN_ID,
          currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]?.address,
          symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]?.symbol
        })
      )
    )
  }, [account, chainId])

  const usdtPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId: chainId ?? NETWORK_CHAIN_ID,
        currency: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.address,
        symbol: CURRENCIES[chainId ?? NETWORK_CHAIN_ID].USDT.symbol
      }),
    [account, chainId]
  )
  const usdtCallbackFn = useCallback(r => {
    setUsdtRes(assetBalanceFormatter(r.data.data))
  }, [])

  const allTokenCallbackFn = useCallback(r => {
    setAllRes(r)
  }, [])

  usePollingWithMaxRetries(usdtPromiseFn, usdtCallbackFn, 300000)
  usePollingWithMaxRetries(allTokenPromiseFn, allTokenCallbackFn, 300000, 5, true)

  const usdtResult: BalanceInfo | undefined = useMemo(() => {
    const usdtRecurTotal = SUPPORTED_CURRENCY_SYMBOL[NETWORK_CHAIN_ID].reduce((acc, symbol, idx) => {
      const { recurAvailable, recurLocked } = formatRecur(
        recurUsdtBalanceRes?.[idx]?.result?.[0],
        recurUsdtLockedBalanceRes?.[idx]?.result?.[0],
        CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]
      )
      return getRecurTotal(acc, getRecurTotal(recurAvailable, recurLocked))
    }, '0')
    return usdtRes
      ? {
          ...usdtRes,
          totalInvest: usdtRes.totalInvest
            ? trimNumberString(getRecurTotal(usdtRes.totalInvest, usdtRecurTotal), 2)
            : '-',
          recurTotal: usdtRecurTotal
        }
      : undefined
  }, [chainId, recurUsdtBalanceRes, recurUsdtLockedBalanceRes, usdtRes])

  const result = useMemo(() => {
    const resultMap = SUPPORTED_CURRENCY_SYMBOL[chainId ?? NETWORK_CHAIN_ID].reduce((acc, symbol, idx) => {
      const { recurAvailable, recurLocked } = formatRecur(
        recurBalanceRes?.[idx]?.result?.[0],
        recurLockedBalanceRes?.[idx]?.result?.[0],
        CURRENCIES[chainId ?? NETWORK_CHAIN_ID][symbol]
      )
      const recurTotal = getRecurTotal(recurLocked, recurAvailable)
      const res = allRes?.[idx]?.data?.data?.Available ? assetBalanceFormatter(allRes[idx].data.data) : undefined
      acc[symbol] = res
        ? {
            ...res,
            recurTotal,
            totalInvest: res.totalInvest ? trimNumberString(getRecurTotal(res.totalInvest, recurTotal), 2) : '-'
          }
        : undefined
      return acc
    }, {} as AccountBalanceType)
    resultMap.USDT = usdtResult
    return resultMap
  }, [allRes, chainId, recurBalanceRes, recurLockedBalanceRes, usdtResult])

  return result
}
