import { useState } from 'react'
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

  usePollingWithMaxRetries(
    () => Axios.get('getProducts'),
    r => setProductList(productListFormatter(r.data.data))
  )

  return productList
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)

  usePollingWithMaxRetries(
    () => Axios.get('getProducts?productId=' + productId),
    r => setProduct(productFormatter(r.data.data))
  )

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

  usePollingWithMaxRetries(
    () => Axios.get('getAccountRecord', { address: account, pageNum, pageSize }),
    r => {
      setAccountRecord(r.data.data)
      setPageParams({
        count: parseInt(r.data.data.pages, 10),
        perPage: parseInt(r.data.data.size, 10),
        total: parseInt(r.data.data.total, 10)
      })
    }
  )

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

  usePollingWithMaxRetries(
    () =>
      Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
        address: account,
        investStatus,
        pageNum,
        pageSize
      }),
    r => {
      setOrderList(r.data.data.records)
      setPageParams({
        count: parseInt(r.data.data.pages, 10),
        perPage: parseInt(r.data.data.size, 10),
        total: parseInt(r.data.data.total, 10)
      })
    }
  )

  return {
    orderList,
    pageParams
  }
}
