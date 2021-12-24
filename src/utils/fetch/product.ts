const TYPE = {
  call: 'CALL',
  put: 'PUT'
}

export enum InvesStatusType {
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error'
}

export const InvesStatus = {
  [1]: InvesStatusType.PENDING,
  [2]: InvesStatusType.SUCCESS,
  [3]: InvesStatusType.SUCCESS,
  [4]: InvesStatusType.SUCCESS,
  [5]: InvesStatusType.ERROR,
  [6]: InvesStatusType.PENDING,
  [7]: InvesStatusType.ERROR
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

export interface ProductList {
  call: Product[]
  put: Product[]
}

export interface OrderRecord {
  address: string
  amount: number
  annualRor: string
  confirmOrderHash: string
  createdAt: number
  currency: string
  deliveryPrice: string
  earn: string
  expiredAt: number
  hash: string
  indexPrice: string
  investStatus: number
  investCurrency: string
  isLiquidated: string
  multiplier: string
  orderId: number
  price: string
  productId: number
  returnedAmount: string
  returnedCurrency: string
  signCount: string
  status: string
  strikeCurrency: string
  strikePrice: string
  ts: number
  type: string
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
  return raw.reduce(
    (acc, item) => {
      const res = productFormatter(item)
      if (item.is_active === false) return acc
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
