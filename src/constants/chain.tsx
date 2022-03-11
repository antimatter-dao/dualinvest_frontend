import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import BSCUrl from 'assets/svg/binance.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import { ReactComponent as AVAX } from 'assets/svg/avax.svg'
import AVAXUrl from 'assets/svg/avax.svg'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  BSC = 56,
  AVAX = 43114
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.BSC

export const IS_TEST_NET = !!(NETWORK_CHAIN_ID === ChainId.ROPSTEN)

export const SUPPORTED_CHAIN_ID: Array<ChainId> = IS_TEST_NET
  ? [ChainId.MAINNET, ChainId.ROPSTEN, ChainId.AVAX, ChainId.BSC]
  : [ChainId.MAINNET, ChainId.BSC, ChainId.AVAX]

export const DUAL_SUPPORT_NETWORK = IS_TEST_NET ? [ChainId.ROPSTEN] : [ChainId.BSC]

export const ChainList: Chain[] = [
  ...(IS_TEST_NET
    ? [
        {
          icon: <ETH />,
          logo: EthUrl,
          symbol: 'Ropsten',
          name: 'Ropsten Test Network',
          id: ChainId.ROPSTEN,
          hex: '0x3'
        }
      ]
    : []),
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BSC',
    name: 'Binance Smart Chain',
    id: ChainId.BSC,
    hex: '0x38'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'ETH',
    name: 'Ethereum Mainnet',
    id: ChainId.MAINNET,
    hex: '0x1'
  },
  {
    icon: <AVAX />,
    logo: AVAXUrl,
    symbol: 'AVAX',
    name: 'Avalanche',
    id: ChainId.AVAX,
    hex: '0xA86A'
  }
]

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/'],
    blockExplorerUrls: ['https://ropsten.etherscan.io/']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.AVAX]: {
    chainId: '0xA86A',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network']
  }
}
