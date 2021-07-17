import React, { useCallback, useState, useMemo } from 'react'
import Modal from 'components/Modal'
import { TransactionErrorContent } from 'components/TransactionConfirmationModal'

const WRAPPER_ID = 'option-card-wrapper'

export function useNetwork(): {
  networkErrorModal: JSX.Element
  networkPendingSpinner: JSX.Element
  wrapperId: string
} {
  const [isOpen, setIsOpen] = useState(false)
  const handleDismiss = useCallback(() => setIsOpen(false), [])
  const networkErrorModal = useMemo(
    () => (
      <Modal isOpen={isOpen} onDismiss={handleDismiss}>
        <TransactionErrorContent message="Network Error" onDismiss={handleDismiss} />
      </Modal>
    ),
    [handleDismiss, isOpen]
  )
  const networkPendingSpinner = useMemo(() => <></>, [])

  const result = useMemo(
    () => ({
      wrapperId: WRAPPER_ID,
      networkErrorModal,
      networkPendingSpinner
    }),
    [networkErrorModal, networkPendingSpinner]
  )

  return result
}
