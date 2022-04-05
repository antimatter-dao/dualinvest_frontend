import { Contract } from '@ethersproject/contracts'
import { abi as GOVERNANCE_ABI } from '../constants/abis/governance.json'
import ANTIMATTER_ABI from '../constants/abis/antimatter.json'
import ANTIMATTER_GOVERNANCE_ABI from '../constants/abis/governance.json'
import { useMemo } from 'react'
import {
  ANTIMATTER_ADDRESS,
  GOVERNANCE_ADDRESS,
  ANTIMATTER_GOVERNANCE_ADDRESS,
  DUAL_INVEST_ADDRESS,
  getDefiVaultAddress
} from '../constants'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import DUAL_INVEST_ABI from '../constants/abis/dual_invest.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import DEFI_VAULT_ABI from '../constants/abis/defi_vault.json'
import { ChainId, NETWORK_CHAIN_ID } from 'constants/chain'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    // switch (chainId) {
    // case ChainId.MAINNET:
    // case ChainId.ROPSTEN:
    // address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    // break
    //}
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true)
}

export function useUniContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? ANTIMATTER_ADDRESS[chainId] : undefined, ANTIMATTER_ABI, true)
}

export function useAntimatterContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? ANTIMATTER_ADDRESS[chainId] : undefined, ANTIMATTER_ABI, true)
}

export function useCallOrPutContract(address: string): Contract | null {
  return useContract(address, ANTIMATTER_ABI, true)
}

export function useSocksController(): Contract | null {
  // const { chainId } = useActiveWeb3React()
  return useContract(
    undefined,
    // chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}

export function useAntiMatterGovernanceContract(): Contract | null {
  return useContract(ANTIMATTER_GOVERNANCE_ADDRESS, ANTIMATTER_GOVERNANCE_ABI, false)
}

export function useDualInvestContract(): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(DUAL_INVEST_ADDRESS[chainId ?? NETWORK_CHAIN_ID], DUAL_INVEST_ABI, true)
}

export function useBSCDualInvestContract(): Contract | null {
  const { account } = useActiveWeb3React()
  return useMemo(() => {
    const library = getOtherNetworkLibrary(NETWORK_CHAIN_ID)
    try {
      if (!DUAL_INVEST_ADDRESS[NETWORK_CHAIN_ID] || !library) return null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getContract(DUAL_INVEST_ADDRESS[NETWORK_CHAIN_ID]!, DUAL_INVEST_ABI, library, account ?? undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [account])
}

export function useDefiVaultContract(
  chainId: ChainId | undefined,
  currencySymbol: string | undefined,
  type: 'CALL' | 'PUT' | undefined
): Contract | null {
  return useContract(getDefiVaultAddress(currencySymbol?.toUpperCase(), chainId, type), DEFI_VAULT_ABI, true)
}
