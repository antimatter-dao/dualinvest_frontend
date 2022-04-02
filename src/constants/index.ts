import { AbstractConnector } from '@web3-react/abstract-connector'
import { Token } from './token'
import { binance, injected, walletconnect, walletlink } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BAST_TOKEN: { [chainId in ChainId]?: Token } = {
  // [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter')
}

export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export const ANTIMATTER_ADDRESS: { [chainId in ChainId]?: string } = {
  // [ChainId.MAINNET]: '0x60d0769c4940cA58648C0AA34ecdf390a10F272e',
  [ChainId.ROPSTEN]: '0x60d0769c4940cA58648C0AA34ecdf390a10F272e',
  [ChainId.BSC]: ''
}

export const ANTIMATTER_GOVERNANCE_ADDRESS = '0x78fC5460737EB07Ce9e7d954B294ecA7E6203D19'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0x78fC5460737EB07Ce9e7d954B294ecA7E6203D19'

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  BINANCE: {
    connector: binance,
    name: 'Binance Wallet',
    iconName: 'bsc.jpg',
    description: 'Login using Binance hosted wallet',
    href: null,
    color: '#F0B90B',
    mobile: true
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

export const DUAL_INVEST_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.ROPSTEN]: '0xCD8C8C39DcE7E5846a7b1BaBb0621250DB7b7430',
  [ChainId.BSC]: '0x7E45149820Fa33B66DCD3fd57158A0E755A67a16',
  [ChainId.RINKEBY]: '0xa5F5954f3f229784BFefE1B4Cc8f3FB5e9CeA13B',
  [ChainId.AVAX]: '0x626B5c394542960faa9495e64E812d17D5B605F9',
  [ChainId.POLYGON]: '0x7E45149820Fa33B66DCD3fd57158A0E755A67a16'
}

export const NO_REFERRER = '0x0000000000000000000000000000000000000000'

export const feeRate = '3%'

export const DEFI_VAULT_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.AVAX]: '0x1ba02c36C0F6F07CA900a6C44e161833509A7768'
}
