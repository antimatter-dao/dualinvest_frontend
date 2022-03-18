import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import { ProductList, productListFormatter, productFormatter, Product } from 'utils/fetch/product'

import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export function useProductList() {
  const [productList, setProductList] = useState<ProductList | undefined>(undefined)
  const { chainId } = useActiveWeb3React()

  const promiseFn = useCallback(() => Axios.get('getProducts', { chainId: chainId ?? NETWORK_CHAIN_ID }), [chainId])

  const callbackFn = useCallback(r => {
    if (!r.data.data || !Array.isArray(r.data.data)) return
    setProductList(productListFormatter(r.data.data))
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return productList
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const { chainId } = useActiveWeb3React()

  const promiseFn = useCallback(
    () => Axios.get('getProducts', { productId: productId, chainId: chainId ?? NETWORK_CHAIN_ID }),
    [chainId, productId]
  )
  const callbackFn = useCallback(r => setProduct(productFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return product
}
