import { useCallback, useEffect, useMemo } from 'react'
import useModal from './useModal'
import { useActiveWeb3React } from 'hooks'
import SwitchChainModal from 'components/Modal/SwitchChainModal'
import { ChainId, ChainListMap, NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'

export function useSwitchChainModal() {
  const { chainId, account, library } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()

  const switchChainCallback = useCallback(
    (toChain: ChainId | undefined) => () => {
      if (!toChain) return
      if ([1, 3, 4, 5, 42].includes(toChain)) {
        library?.send('wallet_switchEthereumChain', [{ chainId: SUPPORTED_NETWORKS[toChain]?.chainId }, account])
      } else {
        const params = SUPPORTED_NETWORKS[toChain]
        library?.send('wallet_addEthereumChain', [params, account])
      }
    },
    [account, library]
  )

  const switchChainModalCallback = useCallback(
    (toChainId = NETWORK_CHAIN_ID) => {
      if (chainId !== toChainId) {
        if (!chainId) return
        showModal(<SwitchChainModal fromChain={ChainListMap[chainId]} toChain={ChainListMap[toChainId]} />)
        return
      }
    },
    [chainId, showModal]
  )

  useEffect(() => {
    hideModal()
  }, [chainId, hideModal])

  return useMemo(
    () => ({
      switchChainModalCallback,
      switchChainCallback
    }),
    [switchChainCallback, switchChainModalCallback]
  )
}
