import { useState, useCallback } from 'react'
import TextButton from 'components/Button/TextButton'
import ActionModal, { ActionType } from './ActionModal'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'

export default function DepositModalButton({ currentCurrency }: { currentCurrency: Token }) {
  const [isOpen, setIsOpen] = useState(false)
  const { account } = useActiveWeb3React()

  const hideDeposit = useCallback(() => {
    setIsOpen(false)
  }, [])

  const showDeposit = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <ActionModal isOpen={isOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <TextButton fontSize={12} color="#11BF2D" style={{ marginLeft: 8 }} onClick={showDeposit} disabled={!account}>
        Deposit
      </TextButton>
    </>
  )
}
