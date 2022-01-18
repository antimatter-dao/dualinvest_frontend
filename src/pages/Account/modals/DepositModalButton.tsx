import { useState, useCallback } from 'react'
import TextButton from 'components/Button/TextButton'
import ActionModal, { ActionType } from './ActionModal'
import { Token } from 'constants/token'

export default function DepositModalButton({ currentCurrency }: { currentCurrency: Token }) {
  const [isOpen, setIsOpen] = useState(false)

  const hideDeposit = useCallback(() => {
    setIsOpen(false)
  }, [])

  const showDeposit = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <ActionModal isOpen={isOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <TextButton fontSize={12} color="#11BF2D" style={{ marginLeft: 8 }} onClick={showDeposit}>
        Deposit
      </TextButton>
    </>
  )
}
