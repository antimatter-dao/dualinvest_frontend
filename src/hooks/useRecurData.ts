import { CURRENCIES } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAddress } from 'utils'
import { Axios } from 'utils/axios'
import { OrderRecord } from 'utils/fetch/record'
import {
  RecurProductRaw,
  recurProductListFormatter,
  RecurProductList,
  singleRecurProductFormatter,
  RecurProduct
} from 'utils/fetch/recur'
import { INVEST_TYPE } from './useAccountData'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { InvestStatus } from './useAccountData'
import { SHA1 } from 'crypto-js'

export function useRecurProcuctList() {
  const [productList, setProductList] = useState<RecurProductList | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get<RecurProductRaw>('getReinProducts'), [])
  const callbackFn = useCallback(r => setProductList(recurProductListFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 60000)

  return productList
}

export function useSingleRecurProcuct(currency: string, type: string) {
  const [productList, setProductList] = useState<RecurProduct | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get<RecurProductRaw>('getReinProducts'), [])
  const callbackFn = useCallback(r => setProductList(singleRecurProductFormatter(r.data.data, currency, type)), [
    currency,
    type
  ])

  usePollingWithMaxRetries(promiseFn, callbackFn, 60000)

  return productList
}

export function useRecurPnl(currency: string | undefined): { totalReInvest: string; pnl: string } {
  const [data, setData] = useState<{ totalReInvest: string; pnl: string }>({ totalReInvest: '-', pnl: '-' })

  const { account } = useActiveWeb3React()

  const promiseFn = useCallback(() => {
    return Axios.get<RecurProductRaw>('getTotalReInvest', {
      account,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currency: CURRENCIES[currency!].address
    })
  }, [account, currency])

  const callbackFn = useCallback(r => {
    setData({ pnl: r?.data?.data?.pnl ?? '-', totalReInvest: r?.data?.data?.totalReInvest ?? '-' })
  }, [])

  usePollingWithMaxRetries(currency ? promiseFn : undefined, callbackFn, 60000)

  return data
}

export enum RECUR_TOGGLE_STATUS {
  close,
  open
}

export function useRecurToggle(
  curAddress: string | undefined,
  vaultAddress: string | undefined
): {
  recurStatus: RECUR_TOGGLE_STATUS | null
  toggleRecur: (setting: RECUR_TOGGLE_STATUS | null) => void
} {
  const [status, setStatus] = useState<RECUR_TOGGLE_STATUS | null>(null)
  const { account } = useActiveWeb3React()

  const callback = useCallback(
    setting => {
      Axios.get(
        'reInvestSwitch',
        setting === null
          ? {
              account,
              currency: curAddress,
              investCurrency: vaultAddress,
              sign: SHA1(`@#MATTER@#invest#${account}#$${curAddress}#$${vaultAddress}#$`).toString()
            }
          : {
              account,
              currency: curAddress,
              investCurrency: vaultAddress,
              type: setting,
              sign: SHA1(`@#MATTER@#invest#${account}#$${curAddress}#$${vaultAddress}#$${setting}#$`).toString()
            }
      ).then(r => {
        if (r.data.data) {
          setStatus(r.data.data.onOff)
        }
      })
    },
    [account, curAddress, vaultAddress]
  )

  useEffect(() => {
    if (!isAddress(curAddress) || !account) return
    callback(null)
  }, [account, callback, curAddress])

  return useMemo(() => {
    return {
      recurStatus: status,
      toggleRecur: callback
    }
  }, [status, callback])
}

export function useRecurActiveOrderCount(
  vaultSymbol: string | undefined,
  curSymbol: string | undefined,
  refresh: number
) {
  const [count, setCount] = useState(0)
  const { account } = useActiveWeb3React()

  const promiseFn = useCallback(() => {
    if (!account) return new Promise((resolve, reject) => reject(null))
    return Axios.get<OrderRecord[]>('getOrderRecord', {
      address: account,
      investType: INVEST_TYPE.recur,
      currency: vaultSymbol,
      investCurrency: curSymbol
    })
  }, [account, curSymbol, vaultSymbol])

  const callbackFn = useCallback(
    r => {
      if (!r.data.data.records) return
      const list = r.data.data.records.filter((record: OrderRecord) => {
        return [InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(record.investStatus)
      })
      setCount(list.length)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh]
  )

  usePollingWithMaxRetries(curSymbol ? promiseFn : undefined, callbackFn, 300000)

  return count
}
