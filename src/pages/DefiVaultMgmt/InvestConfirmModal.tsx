import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { Token } from 'constants/token'

export default function InvestConfirmModal({
  confirmData,
  isOpen,
  onConfirm,
  onDismiss,
  amount,
  currency,
  productTitle,
  actionButton
}: {
  confirmData: { [key: string]: any }
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
  amount: string
  currency: Token | undefined
  productTitle: string
  actionButton?: JSX.Element
}) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      actionButton={actionButton}
      amount={amount}
      data={confirmData}
      title={'Confirm'}
      subTitle={`[${productTitle}]`}
      investCurrency={currency}
      showCompoundWarning
    />
  )
}
