import { trimNumberString } from 'utils/trimNumberString'

interface assetBalanceRaw {
  Investing: string
  Available: string
  Deposit_Amount: string
  PnL: string
}

export type BalanceInfo = {
  available: undefined | string
  locked: undefined | string
  pnl: undefined | string
  totalInvest: undefined | string
  recurLocked?: undefined | string
  recurTotal?: undefined | string
  recurAvailable?: undefined | string
}

export function assetBalanceFormatter(data: assetBalanceRaw): BalanceInfo | undefined {
  if (!data) return undefined
  return {
    available: trimNumberString(data.Available, 4),
    locked: trimNumberString(data.Investing, 4),
    pnl: trimNumberString(data.PnL, 4),
    totalInvest: trimNumberString(data.Deposit_Amount, 4)
  }
}
