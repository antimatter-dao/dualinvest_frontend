import { useState, useCallback, useMemo } from 'react'
import { Axios } from 'utils/axios'
import { ProductList, productListFormatter, productFormatter, Product } from 'utils/fetch/product'
import { AccountRecord } from 'utils/fetch/account'
import { useActiveWeb3React } from 'hooks'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export function useProductList() {
  const [productList, setProductList] = useState<ProductList | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('getProducts'), [])
  const callbackFn = useCallback(r => {
    if (!r.data.data || !Array.isArray(r.data.data)) return
    setProductList(productListFormatter(r.data.data))
  }, [])

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
    if (!account) return new Promise((resolve, reject) => reject(null))
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

  return useMemo(() => {
    return { accountRecord, pageParams }
  }, [accountRecord, pageParams])
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
