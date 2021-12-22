import ReferalModal from 'pages/Account/modals/ReferalModal'
import { useCallback, useMemo } from 'react'
import useModal from './useModal'

export function useReferalModal() {
  const { showModal, hideModal } = useModal()

  const closeReferalModal = useCallback(() => {
    hideModal()
  }, [hideModal])

  const openReferralModal = useCallback(
    (showRedirectButton: boolean) => {
      showModal(<ReferalModal showRedirectButton={showRedirectButton} />)
    },
    [showModal]
  )

  return useMemo(
    () => ({
      openReferralModal,
      closeReferalModal
    }),
    [closeReferalModal, openReferralModal]
  )
}
