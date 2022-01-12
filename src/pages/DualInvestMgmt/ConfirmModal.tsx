import { useParams } from 'react-router-dom'
import { useProduct } from 'hooks/useDualInvestData'
import ConfirmModal from 'components/MgmtPage/ConfirmModal'
import { CURRENCIES } from 'constants/currencies'

export default function DualInvestConfirmModal({
  isOpen,
  onDismiss,
  onConfirm,
  amount,
  data
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  amount: string
  data: { [key: string]: any }
}) {
  const { id } = useParams<{ id: string }>()
  const product = useProduct(id)

  return (
    <ConfirmModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      amount={
        product
          ? (
              +product.multiplier *
              +amount *
              (product ? (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
            ).toFixed(2)
          : '-'
      }
      data={data}
      investCurrency={CURRENCIES[product?.investCurrency ?? 'BTC']}
      title={` ${product?.investCurrency} Financial Management`}
      subTitle={`  [${product?.type === 'CALL' ? 'upward' : 'down'} exercise]`}
      showCancelWarning={false}
    />
  )
}
