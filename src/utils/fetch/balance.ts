interface assetBalanceRaw {
  Amount: string
  Cumulative_Invest: string
  Available: string
  PnL: string
}

export interface BalanceInfo {
  available: undefined | string
  locked: undefined | string
  pnl: undefined | string
  totalInvest: undefined | string
}

export function assetBalanceFormatter(data: assetBalanceRaw) {
  return {
    available: data.Available,
    locked: data.Amount,
    pnl: data.PnL,
    totalInvest: data.Cumulative_Invest
  }
}
