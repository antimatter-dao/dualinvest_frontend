import { useContext, useCallback } from 'react'
import { ModalContext } from '../context/ModalContext'
import WalletModal from 'components/muiModal/WalletModal'

export default function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a provider')
  }

  return context
}

export function useWalletModal() {
  const { showModal, hideModal } = useModal()
  const showWalletModal = useCallback(() => showModal(<WalletModal onDismiss={hideModal} />), [showModal, hideModal])

  return {
    showWalletModal
  }
}
