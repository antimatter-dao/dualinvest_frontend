import { SYMBOL_MAP } from 'constants/currencies'

const TYPE = {
  call: 'CALL',
  put: 'PUT'
}

export interface PrevRecurRaw {
  currency: string
  delivery_price: string
  expired_at: number
  expired_str: string
  index_price: string
  invest_currency: string
  is_active: boolean
  multiplier: string
  order_limit: string
  order_limit_u: string
  product_id: number
  re_invest: boolean
  strike_currency: string
  strike_price: string
  ts: number
  type: string
  usdtEarned: string
  vaultEarned: string
}

export interface PrevRecur {
  apy: string
  strikePrice: string
  deliveryPrice: string
  status: string
  pnl: string
  ts: number
  expiredAt: number
}
export interface RecurProductRaw {
  invest_currency: string
  order_limit_u: number
  is_active: true
  multiplier: number
  index_price: string
  expired_at: number
  type: string
  annual_ror: string
  re_invest: true
  expired_str: string
  price: string
  product_id: number
  strike_currency: string
  currency: string
  order_limit: number
  strike_price: string
  ts: number
}

export interface RecurProduct {
  apy: string
  investCurrency: string
  orderLimitU: number
  isActive: true
  multiplier: number
  indexPrice: string
  type: string
  expiredAt: number
  productId: number
  strikeCurrency: string
  currency: string
  orderLimit: number
  strikePrice: string
  ts: number
}

export type RecurProductList = {
  [key in Partial<keyof typeof SYMBOL_MAP>]: { call: RecurProduct | undefined; put: RecurProduct | undefined }
}

const recurProductFormatter = (raw: RecurProductRaw): RecurProduct => {
  return {
    productId: raw.product_id,
    expiredAt: raw.expired_at * 1000,
    apy: (+raw.annual_ror * 100).toFixed(2) + '%',
    type: raw.type,
    isActive: raw.is_active,
    strikePrice: raw.strike_price,
    multiplier: raw.multiplier,
    currency: raw.currency,
    investCurrency: raw.invest_currency,
    orderLimitU: raw.order_limit_u,
    indexPrice: raw.index_price,
    orderLimit: raw.order_limit,
    ts: raw.ts * 1000,
    strikeCurrency: raw.strike_currency
  }
}

export const recurProductListFormatter = (raw: RecurProductRaw[]): RecurProductList => {
  return raw.reduce((acc, item) => {
    const res = recurProductFormatter(item)
    if (!acc[item.currency as Partial<keyof typeof SYMBOL_MAP>]) {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>] = {
        call: undefined,
        put: undefined
      }
    }
    if (item.type === TYPE.call) {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>].call = res
    } else {
      acc[item.currency as Partial<keyof typeof SYMBOL_MAP>].put = res
    }
    return acc
  }, {} as RecurProductList)
}

export const singleRecurProductFormatter = (
  raw: RecurProductRaw[],
  currency: string,
  type: string
): RecurProduct | undefined => {
  const res: RecurProductRaw | undefined = raw.find(item => {
    return item.currency === currency && item.type.toLowerCase() === type
  })
  return res ? recurProductFormatter(res) : undefined
}

export const prevRecurDetailsFormatter = (raw: PrevRecurRaw): PrevRecur => {
  const exercised =
    raw.type === 'CALL' ? !!(+raw.delivery_price > +raw.strike_price) : !!(+raw.delivery_price < +raw.strike_price)
  return {
    apy: '0%',
    strikePrice: raw.strike_price,
    deliveryPrice: raw.delivery_price,
    status: exercised ? 'Exercised' : 'Unexercised',
    pnl: +raw.usdtEarned > 0 ? raw.usdtEarned + ' USDT' : `${raw.vaultEarned} ${raw.currency}`,
    ts: raw.ts * 1000,
    expiredAt: raw.expired_at * 1000
  }
}
