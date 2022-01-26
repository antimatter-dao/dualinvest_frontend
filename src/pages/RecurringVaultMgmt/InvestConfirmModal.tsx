import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { Token } from 'constants/token'

export default function InvestConfirmModal({
  confirmData,
  isOpen,
  onConfirm,
  onDismiss,
  amount,
  currency,
  productTitle
}: {
  confirmData: { [key: string]: any }
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
  amount: string
  currency: Token | undefined
  productTitle: string
}) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      amount={amount}
      data={confirmData}
      title={'Confirm'}
      subTitle={`【${productTitle}】`}
      investCurrency={currency}
      showCompoundWarning
    />
  )
}
