import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import { ProductList, productListFormatter, productFormatter, Product } from 'utils/fetch/product'

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
