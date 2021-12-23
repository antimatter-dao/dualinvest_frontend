import React, { useState, useCallback, useMemo, useEffect } from 'react'

import { isAddress } from 'utils'
import { NO_REFERRER } from 'constants/index'
import { useReferral } from 'hooks/useReferral'
import BindModal from 'pages/Account/modals/BindModal'

interface BindModalContextType {
  showBindModal: () => void
  hideBindModal: () => void
  tempReferer: string | undefined
  setTempReferer: (referrerAddress: string) => void
  setReferrerParam: (referrerParam: string) => void
}

export const BindModalContext = React.createContext<BindModalContextType>({
  showBindModal: () => {},
  hideBindModal: () => {},
  tempReferer: undefined,
  setTempReferer: () => {},
  setReferrerParam: () => {}
})

export const BindModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [referrerParam, setReferrerParam] = useState<string | undefined>(undefined)
  const [tempReferer, setTempReferer] = useState<string | undefined>(undefined)

  const { invitation } = useReferral()

  useEffect(() => {
    if (invitation && invitation !== NO_REFERRER) {
      setIsOpen(false)
    }
  }, [invitation])

  useEffect(() => {
    if (referrerParam && isAddress(referrerParam) && referrerParam !== NO_REFERRER) {
      setTempReferer(referrerParam)
      setIsOpen(true)
    }
  }, [referrerParam])

  const hideBindModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const showBindModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleTempReferer = useCallback(referrerAddress => {
    setTempReferer(referrerAddress)
  }, [])

  const handleReferralParam = useCallback((val: string) => {
    setReferrerParam(val)
  }, [])

  const val = useMemo(
    () => ({
      hideBindModal,
      showBindModal,
      tempReferer,
      setTempReferer: handleTempReferer,
      setReferrerParam: handleReferralParam
    }),
    [handleReferralParam, handleTempReferer, hideBindModal, showBindModal, tempReferer]
  )

  return (
    <BindModalContext.Provider value={val}>
      {children}
      <BindModal
        isOpen={isOpen}
        onDismiss={hideBindModal}
        referer={invitation && invitation !== NO_REFERRER ? invitation : undefined}
        tempReferrer={tempReferer}
      />
    </BindModalContext.Provider>
  )
}
