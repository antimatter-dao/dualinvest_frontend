import { useState, useCallback, useMemo } from 'react'
import { Axios } from 'utils/axios'
import { OrderRecord } from 'utils/fetch/record'
import { useActiveWeb3React } from 'hooks'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import { AccountRecord } from 'utils/fetch/account'
import { ChainId, NETWORK_CHAIN_ID } from 'constants/chain'

export enum InvestStatus {
  Confirming = 1,
  Ordered = 2,
  ReadyToSettle = 3,
  Settled = 4,
  OrderFailed = 5,
  OrderSuccess = 6,
  EverythingFailed = 7
}

export enum INVEST_TYPE {
  DO_NOT_USE_THIS,
  dualInvest,
  recur
}

const PageSize = 8

export type FilterType = 'All' | typeof SUPPORTED_CURRENCY_SYMBOL[ChainId][number]

export function useOrderRecords(
  investType: INVEST_TYPE,
  currency: FilterType,
  investStatus?: number | number[],
  pageNum?: number,
  pageSize?: number
) {
  const { account, chainId } = useActiveWeb3React()
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const filteredOrderList = useMemo(() => {
    if (!Array.isArray(investStatus) || !orderList) return undefined
    return orderList.reduce((acc, order) => {
      if (currency !== 'All' && order.currency !== currency) {
        return acc
      }
      if (investStatus.includes(order.investStatus) && order.investStatus === InvestStatus.ReadyToSettle) {
        acc.unshift(order)
        return acc
      }
      if (investStatus.includes(order.investStatus)) {
        acc.push(order)
        return acc
      }
      return acc
    }, [] as OrderRecord[])
  }, [currency, investStatus, orderList])

  const pageCount = useMemo(() => {
    if (!filteredOrderList) return 0

    return Math.ceil(filteredOrderList.length / PageSize)
  }, [filteredOrderList])

  const promiseFn = useCallback(() => {
    if (!account)
      return new Promise((resolve, reject) => {
        reject(null)
      })
    return Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
      address: account,
      investType,
      chainId: chainId ?? NETWORK_CHAIN_ID,
      investStatus: Array.isArray(investStatus) ? undefined : investStatus,
      pageNum: Array.isArray(investStatus) ? undefined : pageNum,
      pageSize: Array.isArray(investStatus) ? 999999 : pageSize,
      currency: currency === 'All' ? undefined : currency
    })
  }, [account, chainId, currency, investStatus, investType, pageNum, pageSize])

  const callbackFn = useCallback(r => {
    setOrderList(r.data.data.records)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return useMemo(() => {
    if (Array.isArray(investStatus)) {
      return {
        orderList:
          pageNum && filteredOrderList
            ? filteredOrderList.slice((pageNum - 1) * PageSize, pageNum * PageSize)
            : undefined,
        pageParams: { count: pageCount, perPage: PageSize, total: filteredOrderList?.length ?? 0 }
      }
    } else {
      return {
        orderList,
        pageParams
      }
    }
  }, [filteredOrderList, investStatus, orderList, pageCount, pageNum, pageParams])
}

export function useAccountRecord(pageNum = 1, pageSize = 8) {
  const { account, chainId } = useActiveWeb3React()
  const [accountRecord, setAccountRecord] = useState<AccountRecord | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const promiseFn = useCallback(() => {
    if (!account) return new Promise((resolve, reject) => reject(null))
    return Axios.get('getAccountRecord', { account, pageNum, pageSize, chainId: chainId ?? NETWORK_CHAIN_ID })
  }, [account, chainId, pageNum, pageSize])

  const callbackFn = useCallback(r => {
    setAccountRecord(r.data.data)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return useMemo(() => {
    return { accountRecord, pageParams }
  }, [accountRecord, pageParams])
}
