import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
// import BSCUrl from 'assets/svg/binance.svg'
// import { ReactComponent as BSCInvert } from 'assets/svg/binance.svg'

export enum ChainId {
  // MAINNET = 1,
  ROPSTEN = 3
  // BSC = 56
}

export const ChainList = [
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Ropsten',
    name: 'Ropsten Test Network',
    id: ChainId.ROPSTEN,
    hex: '0x3'
  }
  // {
  //   icon: <BSCInvert height={20} width={20} />,
  //   logo: BSCUrl,
  //   symbol: 'BSC',
  //   name: 'Binance Smart Chain',
  //   id: ChainId.BSC,
  //   hex: '0x38'
  // }
]

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
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
  // [ChainId.MAINNET]: {
  //   chainId: '0x1',
  //   chainName: 'Ethereum',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18
  //   },
  //   rpcUrls: ['https://mainnet.infura.io/v3'],
  //   blockExplorerUrls: ['https://etherscan.com']
  // },
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
  }
  // [ChainId.BSC]: {
  //   chainId: '0x38',
  //   chainName: 'Binance Smart Chain',
  //   nativeCurrency: {
  //     name: 'Binance Coin',
  //     symbol: 'BNB',
  //     decimals: 18
  //   },
  //   rpcUrls: ['https://bsc-dataseed.binance.org'],
  //   blockExplorerUrls: ['https://bscscan.com']
  // }
}
