import wrapPromise from './wrapPromise'
import { Axios } from 'utils/axios'

const TYPE = {
  call: 'call',
  put: 'put'
}

interface ProductRaw {
  annual_ror: string
  currency: string
  expired_at: number
  expired_str: string
  index_price: string
  invest_currency: string
  is_active: boolean
  multiplier: string
  order_limit: string
  order_limit_u: string
  price: string
  product_id: number
  strike_currency: string
  strike_price: string
  ts: number
  type: string
}

export interface Product {
  productId: number
  expiredAt: string
  apy: string
  type: string
  isActive: boolean
  strikePrice: string
  currentPrice: string
  multiplier: string
  currency: string
  orderLimit: string
}

export interface ProductList {
  call: Product[]
  put: Product[]
}

export const fetchProductList = () => {
  return wrapPromise<ProductList>(
    Axios.get('getProducts')
      .then(r => {
        if (r.data.code !== 200) {
          throw Error(r.data.msg)
        }
        return productListFormatter(r.data.data)
      })
      .catch(e => {
        console.error(e)
      })
  )
}

export const fetchProduct = () => {
  return wrapPromise<ProductList>(
    Axios.get('getProducts')
      .then(r => {
        if (r.data.code !== 200) {
          throw Error(r.data.msg)
        }
        return productListFormatter(r.data.data)
      })
      .catch(e => {
        console.error(e)
      })
  )
}
export const productFormatter = (raw: ProductRaw): Product => {
  return {
    currentPrice: raw.index_price,
    productId: raw.product_id,
    expiredAt: raw.expired_str,
    apy: raw.annual_ror,
    type: raw.type,
    isActive: raw.is_active,
    strikePrice: raw.strike_price,
    multiplier: raw.multiplier,
    currency: raw.currency,
    orderLimit: raw.order_limit
  }
}

export const productListFormatter = (raw: ProductRaw[]): ProductList => {
  return raw.reduce(
    (acc, item) => {
      const res = productFormatter(item)
      if (item.type === TYPE.call) {
        acc.call.push(res)
      } else {
        acc.put.push(res)
      }
      return acc
    },
    { call: [], put: [] } as { call: any[]; put: any[] }
  )
}
