export interface NFT {
  chainId?: number
  mainChainId?: number
  mainAddress: string
  contractAddress: string
  tokenId: string
  name?: string
  tokenUri?: string
  owner?: string
  symbol?: string
}
