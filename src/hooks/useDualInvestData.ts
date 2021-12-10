import { useEffect, useState } from 'react'
import { Axios } from 'utils/axios'
import { ProductList, productListFormatter, productFormatter, Product, OrderRecord } from 'utils/fetch/product'
import { AccountRecord } from 'utils/fetch/account'
import { useActiveWeb3React } from 'hooks'

export function useProductList() {
  const [productList, setProductList] = useState<ProductList | undefined>(undefined)

  useEffect(() => {
    const id = setInterval(() => {
      Axios.get('getProducts')
        .then(r => {
          if (r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          setProductList(productListFormatter(r.data.data))
        })
        .catch(e => {
          console.error(e)
        })
    }, 3000)

    return () => {
      clearInterval(id)
    }
  })
  return productList
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)

  useEffect(() => {
    const id = setInterval(() => {
      Axios.get('getProducts?productId=' + productId)
        .then(r => {
          if (r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          setProduct(productFormatter(r.data.data))
        })
        .catch(e => {
          console.error(e)
        })
    }, 3000)

    return () => {
      clearInterval(id)
    }
  })
  return product
}

export function useAccountRecord() {
  const { account } = useActiveWeb3React()
  const [accountRecord, setAccountRecord] = useState<AccountRecord | undefined>(undefined)

  useEffect(() => {
    const id = setInterval(() => {
      Axios.get('getAccountRecord', { address: account })
        .then(r => {
          if (r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          setAccountRecord(r.data.data)
        })
        .catch(e => {
          console.error(e)
        })
    }, 3000)

    return () => {
      clearInterval(id)
    }
  })
  return accountRecord
}

export enum InvestStatus {
  Confirming = 1,
  Ordered = 2,
  ReadyToSettle = 3,
  Settled = 4,
  OrderFailed = 5,
  OrderSuccess = 6
}

export function useOrderRecords(investStatus?: number) {
  const { account } = useActiveWeb3React()
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  console.log(account)
  useEffect(() => {
    const id = setInterval(() => {
      Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
        address: null,
        investStatus: investStatus
      })
        .then(r => {
          if (r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          setOrderList(r.data.data.records)
          setPageParams({
            count: parseInt(r.data.data.pages, 10),
            perPage: parseInt(r.data.data.size, 10),
            total: parseInt(r.data.data.total, 10)
          })
        })
        .catch(e => {
          console.error(e)
        })
    }, 3000)

    return () => {
      clearInterval(id)
    }
  })
  return {
    orderList,
    pageParams
  }
}
