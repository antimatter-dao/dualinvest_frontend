import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { Token } from 'constants/token'
import { ApprovalState } from 'hooks/useApproveCallback'

export default function InvestConfirmModal({
  confirmData,
  isOpen,
  onConfirm,
  onDismiss,
  amount,
  currency,
  productTitle,
  approvalState
}: {
  confirmData: { [key: string]: any }
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
  amount: string
  currency: Token | undefined
  productTitle: string
  approvalState?: ApprovalState
}) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      approvalState={approvalState}
      amount={amount}
      data={confirmData}
      title={'Confirm'}
      subTitle={`[${productTitle}]`}
      investCurrency={currency}
      showCompoundWarning
    />
  )
}
