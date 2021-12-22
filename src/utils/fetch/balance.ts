interface assetBalanceRaw {
  Investing: string
  Available: string
  Deposit_Amount: string
  PnL: string
}

export interface BalanceInfo {
  available: undefined | string
  locked: undefined | string
  pnl: undefined | string
  totalInvest: undefined | string
}

export function assetBalanceFormatter(data: assetBalanceRaw) {
  if (!data) return undefined
  return {
    available: data.Available,
    locked: data.Investing,
    pnl: data.PnL,
    totalInvest: data.Deposit_Amount
  }
}
