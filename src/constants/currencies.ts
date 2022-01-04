import { Token } from './token'
import BtcLogo from 'assets/svg/btc_logo.svg'
import UsdtLogo from 'assets/svg/usdt_logo.svg'

export const SYMBOL_MAP = {
  BTC: 'BTC',
  USDT: 'USDT',
  BTCT: 'BTC',
  ETH: 'ETH'
}

export const SUPPORTED_CURRENCIES: {
  [key: string]: {
    address: string
    decimals: number
    symbol: string
    name: string
    logoUrl: string
  }
} = {
  BTC: {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 18,
    symbol: 'BTC',
    name: 'Binance-Peg BTCB Token',
    logoUrl: BtcLogo
  },
  USDT: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
    name: 'Binance-Peg BSC-USDT',
    logoUrl: UsdtLogo
  }
}

export const CURRENCIES = Object.keys(SUPPORTED_CURRENCIES).reduce((acc, key) => {
  const item = SUPPORTED_CURRENCIES[key as keyof typeof SUPPORTED_CURRENCIES]
  acc[key as keyof typeof SUPPORTED_CURRENCIES] = new Token(3, item.address, item.decimals, item.symbol, item.name)

  return acc
}, {} as { [key: string]: Token })

export const CURRENCY_ADDRESS_MAP = Object.keys(SUPPORTED_CURRENCIES).reduce((acc, key) => {
  const item = SUPPORTED_CURRENCIES[key as keyof typeof SUPPORTED_CURRENCIES]
  acc[item.address as keyof typeof SUPPORTED_CURRENCIES] = new Token(
    3,
    item.address,
    item.decimals,
    item.symbol,
    item.name
  )

  return acc
}, {} as { [key: string]: Token })
