import { useCallback, useEffect, useMemo } from 'react'
import useModal from './useModal'
import { useActiveWeb3React } from 'hooks'
import SwitchChainModal from 'components/Modal/SwitchChainModal'
import { ChainListMap, NETWORK_CHAIN_ID } from 'constants/chain'

export function useSwitchChainModal() {
  const { chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()

  const switchChain = useCallback(
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
      switchChain
    }),
    [switchChain]
  )
}
