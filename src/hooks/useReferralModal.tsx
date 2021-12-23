import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { BindModalContext } from 'context/BindContext'
import ReferalModal from 'pages/Account/modals/ReferalModal'
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

export function useBindModal() {
  const context = useContext(BindModalContext)
  const { referrer } = useParams<{ referrer: string }>()

  useEffect(() => {
    context.setReferrerParam(referrer)
  }, [context, referrer])

  return context
}
