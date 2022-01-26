import { CURRENCIES } from 'constants/currencies'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAddress } from 'utils'
import { Axios } from 'utils/axios'
import {
  RecurProductRaw,
  recurProductListFormatter,
  RecurProductList,
  singleRecurProductFormatter,
  RecurProduct
} from 'utils/fetch/recur'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

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

export function useRecurPnl(currency: string | undefined) {
  const [pnl, setPnl] = useState<string>('-')

  const { account } = useActiveWeb3React()

  const promiseFn = useCallback(() => {
    return Axios.get<RecurProductRaw>('getTotalReInvest', {
      account,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currency: CURRENCIES[currency!].address
    })
  }, [account, currency])

  const callbackFn = useCallback(r => {
    setPnl(r.data.data.pnl)
  }, [])

  usePollingWithMaxRetries(currency ? promiseFn : undefined, callbackFn, 60000)

  return pnl
}

export enum RECUR_TOGGLE_STATUS {
  close,
  open
}

export function useRecurToggle(
  curAddress: string | undefined
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
        setting !== null
          ? {
              account,
              currency: curAddress,
              type: setting
            }
          : {
              account,
              currency: curAddress
            }
      ).then(r => {
        if (r.data.data) {
          setStatus(r.data.data.onOff)
        }
      })
    },
    [account, curAddress]
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
