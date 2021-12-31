import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  // [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed'
  // [ChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
