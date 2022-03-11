import { useCallback, useEffect, useMemo } from 'react'
import useModal from './useModal'
import { useActiveWeb3React } from 'hooks'
import SwitchChainModal from 'components/Modal/SwitchChainModal'
import { ChainListMap, NETWORK_CHAIN_ID } from 'constants/chain'

export function useSwitchChainModal(toChainId = NETWORK_CHAIN_ID) {
  const { chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()

  const switchChain = useCallback(() => {
    if (chainId !== toChainId) {
      if (!chainId) return
      showModal(<SwitchChainModal fromChain={ChainListMap[chainId]} toChain={ChainListMap[toChainId]} />)
      return
    }
  }, [chainId, showModal, toChainId])

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
