import { ChainId, ChainList, IS_TEST_NET, NETWORK_CHAIN_ID } from 'constants/chain'
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
  chain: string
}

export interface Product {
  chainId: ChainId
  chain: string
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
  price: string
}

export type SingleCurProductList = { call: Product[]; put: Product[] }

export type ProductList = {
  [key in Partial<keyof typeof SYMBOL_MAP>]: SingleCurProductList
}

export const productFormatter = (raw: ProductRaw): Product => {
  const chainIdFunc = (chain: string) => {
    if (IS_TEST_NET) {
      if (chain === 'AVAX') {
        return ChainId.RINKEBY
      }
      if (chain === 'BSC') {
        return ChainId.ROPSTEN
      }
    }
    return ChainList.find(chain => chain.symbol === raw.chain)?.id ?? NETWORK_CHAIN_ID
  }
  return {
    chain: raw.chain,
    chainId: chainIdFunc(raw.chain),
    price: raw.price,
    currentPrice: raw.index_price,
    productId: raw.product_id,
    expiredAt: raw.expired_at * 1000,
    apy: raw.annual_ror,
    type: raw.type,
    isActive: raw.is_active && raw.annual_ror ? true : false,
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
