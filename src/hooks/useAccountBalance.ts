import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { Axios } from 'utils/axios'
import { assetBalanceFormatter, BalanceInfo } from 'utils/fetch/balance'
import { CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { useRecurBalance } from './useRecur'
import { trimNumberString } from 'utils/trimNumberString'

const getRecurTotal = (balanceLocked: string, balanceAvailable: string) => {
  if (balanceLocked === '-' || balanceAvailable === '-') {
    return '-'
  }
  return trimNumberString((+balanceLocked + +balanceAvailable).toFixed(4), 4)
}

export function useAccountBalances(): {
  [key: typeof SUPPORTED_CURRENCY_SYMBOL[number]]: BalanceInfo | undefined
} {
  const [btcRes, setBtcRes] = useState<BalanceInfo | undefined>(undefined)
  const [usdtRes, setUsdtRes] = useState<BalanceInfo | undefined>(undefined)
  const [ethRes, setEthRes] = useState<BalanceInfo | undefined>(undefined)
  const [bnbRes, setBnbRes] = useState<BalanceInfo | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()

  const btcBtcRecur = useRecurBalance(CURRENCIES.BTC, CURRENCIES.BTC)
  const ethEthRecur = useRecurBalance(CURRENCIES.ETH, CURRENCIES.ETH)
  const btcUsdtRecur = useRecurBalance(CURRENCIES.BTC, CURRENCIES.USDT)
  const ethUsdtRecur = useRecurBalance(CURRENCIES.ETH, CURRENCIES.USDT)

  const bnbPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.BNB.address,
        symbol: CURRENCIES.BNB.symbol
      }),
    [account, chainId]
  )

  const bnbCallbackFn = useCallback(r => {
    setBnbRes(assetBalanceFormatter(r.data.data))
  }, [])

  const btcPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.BTC.address,
        symbol: CURRENCIES.BTC.symbol
      }),
    [account, chainId]
  )

  const btcCallbackFn = useCallback(r => {
    setBtcRes(assetBalanceFormatter(r.data.data))
  }, [])

  const usdtPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.USDT.address,
        symbol: CURRENCIES.USDT.symbol
      }),
    [account, chainId]
  )
  const usdtCallbackFn = useCallback(r => setUsdtRes(assetBalanceFormatter(r.data.data)), [])

  const ethPromiseFn = useCallback(
    () =>
      Axios.post('getUserAssets', undefined, {
        account,
        chainId,
        currency: CURRENCIES.ETH.address,
        symbol: CURRENCIES.ETH.symbol
      }),
    [account, chainId]
  )
  const ethCallbackFn = useCallback(r => {
    setEthRes(assetBalanceFormatter(r.data.data))
  }, [])

  usePollingWithMaxRetries(btcPromiseFn, btcCallbackFn, 300000)
  usePollingWithMaxRetries(usdtPromiseFn, usdtCallbackFn, 300000)
  usePollingWithMaxRetries(ethPromiseFn, ethCallbackFn, 30000)
  usePollingWithMaxRetries(bnbPromiseFn, bnbCallbackFn, 30000)

  return useMemo(() => {
    const btcRecurTotal = getRecurTotal(btcBtcRecur.autoLockedBalance, btcBtcRecur.autoBalance)
    const ethRecurTotal = getRecurTotal(ethEthRecur.autoLockedBalance, ethEthRecur.autoBalance)
    const usdtRecurTotal = getRecurTotal(
      getRecurTotal(btcUsdtRecur.autoLockedBalance, btcUsdtRecur.autoBalance),
      getRecurTotal(ethUsdtRecur.autoLockedBalance, ethUsdtRecur.autoBalance)
    )

    return {
      BTC: btcRes
        ? {
            ...btcRes,
            recurAvailable: btcBtcRecur.autoBalance,
            recurLocked: btcBtcRecur.autoLockedBalance,
            recurTotal: btcRecurTotal,
            totalInvest: btcRes.totalInvest
              ? trimNumberString(getRecurTotal(btcRes.totalInvest, btcRecurTotal), 2)
              : '-'
          }
        : undefined,
      ETH: ethRes
        ? {
            ...ethRes,
            recurAvailable: ethEthRecur.autoBalance,
            recurLocked: ethEthRecur.autoLockedBalance,
            recurTotal: ethRecurTotal,
            totalInvest: ethRes.totalInvest
              ? trimNumberString(getRecurTotal(ethRes.totalInvest, ethRecurTotal), 2)
              : '-'
          }
        : undefined,
      USDT: usdtRes
        ? {
            ...usdtRes,
            recurTotal: usdtRecurTotal,
            totalInvest: usdtRes.totalInvest
              ? trimNumberString(getRecurTotal(usdtRes.totalInvest, usdtRecurTotal), 2)
              : '-'
          }
        : undefined,
      BNB: bnbRes ? { ...bnbRes } : undefined
    }
  }, [
    btcBtcRecur.autoLockedBalance,
    btcBtcRecur.autoBalance,
    ethEthRecur.autoLockedBalance,
    ethEthRecur.autoBalance,
    btcUsdtRecur.autoLockedBalance,
    btcUsdtRecur.autoBalance,
    ethUsdtRecur.autoLockedBalance,
    ethUsdtRecur.autoBalance,
    btcRes,
    ethRes,
    usdtRes,
    bnbRes
  ])
}
