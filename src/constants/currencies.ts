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
    address: '0x9c1CFf4E5762e8e1F95DD3Cc74025ba8d0e71F93',
    decimals: 18,
    symbol: 'BTC',
    name: 'Binance-Peg BTCB Token',
    logoUrl: BtcLogo
  },
  USDT: {
    address: '0xE78D911B56a6321bF622172D32D916f9563e8D84',
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
