import { Token } from './token'
import BtcLogo from 'assets/svg/btc_logo.svg'
import UsdtLogo from 'assets/svg/usdt_logo.svg'
import EthLogo from 'assets/svg/eth_logo.svg'
import BSCLogo from 'assets/svg/binance.svg'
import { ChainId, ChainList } from './chain'

export const SYMBOL_MAP = {
  BTC: 'BTC',
  USDT: 'USDT',
  BTCT: 'BTC',
  ETH: 'ETH',
  BTCB: 'BTC',
  BNB: 'BNB',
  WBNB: 'BNB'
}

export const SUPPORTED_CURRENCY_SYMBOL = [SYMBOL_MAP.BTC, SYMBOL_MAP.ETH, SYMBOL_MAP.BNB]

export const SUPPORTED_CURRENCIES: {
  [key: string]: {
    address: { [key in ChainId]: string }
    decimals: number
    symbol: string
    name: string
    logoUrl: string
    color?: string
  }
} = {
  BTC: {
    address: {
      [ChainId.ROPSTEN]: '0x9c1CFf4E5762e8e1F95DD3Cc74025ba8d0e71F93',
      [ChainId.BSC]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'
    },
    decimals: 18,
    symbol: 'BTC',
    name: 'Binance-Peg BTCB Token',
    logoUrl: BtcLogo,
    color: '#FD8B00'
  },
  BTCB: {
    address: {
      [ChainId.ROPSTEN]: '0x9c1CFf4E5762e8e1F95DD3Cc74025ba8d0e71F93',
      [ChainId.BSC]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'
    },
    decimals: 18,
    symbol: 'BTC',
    name: 'Binance-Peg BTCB Token',
    logoUrl: BtcLogo,
    color: '#FD8B00'
  },
  USDT: {
    address: {
      [ChainId.ROPSTEN]: '0xE78D911B56a6321bF622172D32D916f9563e8D84',
      [ChainId.BSC]: '0x55d398326f99059fF775485246999027B3197955'
    },
    decimals: 18,
    symbol: 'USDT',
    name: 'Binance-Peg BSC-USDT',
    logoUrl: UsdtLogo,
    color: '#31B047'
  },
  ETH: {
    address: {
      [ChainId.ROPSTEN]: '0x55795b02C44Bd098D21bC1854036C2E75d7E7c43',
      [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
    },
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    logoUrl: EthLogo,
    color: '#656565'
  },
  BNB: {
    address: {
      [ChainId.ROPSTEN]: '0x570D3f51D7406b641e63614E4584e3B3dEC90Bc5',
      [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    },
    decimals: 18,
    symbol: 'BNB',
    name: 'Wrapped BNB',
    logoUrl: BSCLogo,
    color: '#F3BA2F'
  },
  WBNB: {
    address: {
      [ChainId.ROPSTEN]: '0x570D3f51D7406b641e63614E4584e3B3dEC90Bc5',
      [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    },
    decimals: 18,
    symbol: 'BNB',
    name: 'Wrapped BNB',
    logoUrl: BSCLogo,
    color: '#F3BA2F'
  }
}

export const CURRENCIES: { [key in ChainId]: { [key: string]: Token } } = ChainList.reduce(
  (acc: { [key in ChainId]: { [key: string]: Token } }, { id }: { id: ChainId }) => {
    // acc[+chainId as ChainId] = new Token(3, item.address[+chainId as ChainId], item.decimals, item.symbol, item.name)
    // return acc
    const tokenMap = Object.keys(SUPPORTED_CURRENCIES).reduce((acc: { [key: string]: Token }, key) => {
      const item = SUPPORTED_CURRENCIES[key as keyof typeof SUPPORTED_CURRENCIES]
      acc[key as keyof typeof SUPPORTED_CURRENCIES] = new Token(
        id,
        item.address[id],
        item.decimals,
        item.symbol,
        item.name
      )
      return acc
    }, {} as { [key: string]: Token })

    acc[id] = tokenMap
    return acc
  },
  {} as { [key in ChainId]: { [key: string]: Token } }
)

export const CURRENCY_ADDRESS_MAP = Object.keys(SUPPORTED_CURRENCIES).reduce((acc, key) => {
  const item = SUPPORTED_CURRENCIES[key as keyof typeof SUPPORTED_CURRENCIES]
  Object.keys(item.address).map((chainId: string) => {
    const address = item.address[+chainId as ChainId]
    acc[address as keyof typeof SUPPORTED_CURRENCIES] = new Token(
      +chainId,
      address,
      item.decimals,
      item.symbol,
      item.name
    )
  })

  return acc
}, {} as { [key: string]: Token })
