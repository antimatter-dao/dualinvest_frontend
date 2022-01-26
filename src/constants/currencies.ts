import { Token } from './token'
import BtcLogo from 'assets/svg/btc_logo.svg'
import UsdtLogo from 'assets/svg/usdt_logo.svg'
import EthLogo from 'assets/svg/eth_logo.svg'
import MatterLogo from 'assets/svg/antimatter_circle_black.svg'

export const SYMBOL_MAP = {
  BTC: 'BTC',
  USDT: 'USDT',
  BTCT: 'BTC',
  ETH: 'ETH'
}

export const SUPPORTED_CURRENCY_SYMBOL = [SYMBOL_MAP.BTC, SYMBOL_MAP.ETH]

export const SUPPORTED_CURRENCIES: {
  [key: string]: {
    address: string
    decimals: number
    symbol: string
    name: string
    logoUrl: string
    color?: string
  }
} = {
  BTC: {
    address:
      parseInt(process.env.REACT_APP_CHAIN_ID ?? '') === 3
        ? '0x9c1CFf4E5762e8e1F95DD3Cc74025ba8d0e71F93'
        : '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 18,
    symbol: 'BTC',
    name: 'Binance-Peg BTCB Token',
    logoUrl: BtcLogo,
    color: '#FD8B00'
  },
  USDT: {
    address:
      parseInt(process.env.REACT_APP_CHAIN_ID ?? '') === 3
        ? '0xE78D911B56a6321bF622172D32D916f9563e8D84'
        : '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
    name: 'Binance-Peg BSC-USDT',
    logoUrl: UsdtLogo,
    color: '#31B047'
  },
  ETH: {
    address: '0x81b7E08F65Bdf5648606c89998A9CC8164397647',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    logoUrl: EthLogo,
    color: '#656565'
  },
  MATTER: {
    address: '0x60d0769c4940cA58648C0AA34ecdf390a10F272e',
    decimals: 18,
    symbol: 'MATTER',
    name: 'Antimatter',
    logoUrl: MatterLogo
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
