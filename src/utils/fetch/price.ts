import { LineSeriesData } from 'components/Chart'
import { Time } from 'lightweight-charts'

export enum kLineProps {
  openTime,
  open,
  high,
  low,
  close,
  volume,
  closeTime,
  quoteAssetVolume,
  numberOfTrades,
  TakerBuyBaseAssetVolume,
  TakerBuyQuoteAssetVolume,
  Ignore
}

export const priceFormatter = (raw: (string | number)[][]): LineSeriesData => {
  return raw.map(item => {
    return {
      time: item[kLineProps.openTime] as Time,
      value: +item[kLineProps.open]
    }
  })
}
