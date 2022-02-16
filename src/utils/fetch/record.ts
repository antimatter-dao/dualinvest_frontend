import { INVEST_TYPE } from 'hooks/useAccountData'

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
  investType: INVEST_TYPE
}
