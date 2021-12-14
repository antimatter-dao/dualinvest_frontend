import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import { ProductList, productListFormatter, productFormatter, Product, OrderRecord } from 'utils/fetch/product'
import { AccountRecord } from 'utils/fetch/account'
import { useActiveWeb3React } from 'hooks'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export enum InvestStatus {
  Confirming = 1,
  Ordered = 2,
  ReadyToSettle = 3,
  Settled = 4,
  OrderFailed = 5,
  OrderSuccess = 6
}

export function useProductList() {
  const [productList, setProductList] = useState<ProductList | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('getProducts'), [])
  const callbackFn = useCallback(r => setProductList(productListFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return productList
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('getProducts?productId=' + productId), [productId])
  const callbackFn = useCallback(r => setProduct(productFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return product
}

export function useAccountRecord(pageNum = 1, pageSize = 8) {
  const { account } = useActiveWeb3React()
  const [accountRecord, setAccountRecord] = useState<AccountRecord | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const promiseFn = useCallback(() => {
    if (!account) return new Promise((resolve, reject) => reject('No account'))
    return Axios.get('getAccountRecord', { account, pageNum, pageSize })
  }, [account, pageNum, pageSize])
  const callbackFn = useCallback(r => {
    setAccountRecord(r.data.data)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return { accountRecord, pageParams }
}

export function useOrderRecords(investStatus?: number, pageNum?: number, pageSize?: number) {
  const { account } = useActiveWeb3React()
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const promiseFn = useCallback(
    () =>
      Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
        address: account,
        investStatus,
        pageNum,
        pageSize
      }),
    [account, investStatus, pageNum, pageSize]
  )
  const callbackFn = useCallback(r => {
    setOrderList(r.data.data.records)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return {
    orderList,
    pageParams
  }
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<
    | {
        totalBtcDeposit: string
        totalInvestAmount: string
        totalUsdtDeposit: string
      }
    | undefined
  >(undefined)

  const promistFn = useCallback(() => Axios.get('getDashboard'), [])
  const callbackFn = useCallback(r => {
    setStatistics(r.data.data)
  }, [])

  usePollingWithMaxRetries(promistFn, callbackFn, 600000)

  return statistics
}
