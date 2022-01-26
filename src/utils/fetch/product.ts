import { SYMBOL_MAP } from 'constants/currencies'

const TYPE = {
  call: 'CALL',
  put: 'PUT'
}

export interface createOrder {
  address: string
  amount: number
  currency: string
  investStatus: 1 | 2 | 3 | 4 | 5 | 6
  orderId: number
  productId: number
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
  gt_strike_price: string
  lt_strike_price: string
}

export interface Product {
  productId: number
  expiredAt: number
  apy: string
  type: string
  isActive: boolean
  strikePrice: string
  currentPrice: string
  multiplier: string
  currency: string
  investCurrency: string
  orderLimit: string
  ts: number
  gtStrikePrice: string
  ltStrikePrice: string
  strikeCurrency: string
}

export type SingleCurProductList = { call: Product[]; put: Product[] }

export type ProductList = {
  [key in Partial<keyof typeof SYMBOL_MAP>]: SingleCurProductList
}

export const productFormatter = (raw: ProductRaw): Product => {
  return {
    currentPrice: raw.index_price,
    productId: raw.product_id,
    expiredAt: raw.expired_at * 1000,
    apy: raw.annual_ror,
    type: raw.type,
    isActive: raw.is_active,
    strikePrice: raw.strike_price,
    multiplier: raw.multiplier,
    currency: raw.currency,
    investCurrency: raw.invest_currency,
    orderLimit: raw.order_limit,
    ts: raw.ts * 1000,
    gtStrikePrice: raw.gt_strike_price,
    ltStrikePrice: raw.lt_strike_price,
    strikeCurrency: raw.strike_currency
  }
}

export const productListFormatter = (raw: ProductRaw[]): ProductList => {
  return raw.reduce((acc, item) => {
    if (!acc[item.currency as Partial<keyof typeof SYMBOL_MAP>]) {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>] = {
        call: [],
        put: []
      }
    }
    if (item.type === TYPE.call) {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>].call.push(productFormatter(item))
    } else {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>].put.push(productFormatter(item))
    }
    return acc
  }, {} as ProductList)
}
