import { CURRENCIES } from 'constants/currencies'
import ConfirmModal from 'components/MgmtPage/ConfirmModal'

export default function VaultConfirmModal({ confirmData }: { confirmData: { [key: string]: any } }) {
  return (
    <ConfirmModal
      isOpen={false}
      onDismiss={() => {}}
      onConfirm={() => {}}
      amount="0.000"
      data={confirmData}
      title={'Confirm'}
      subTitle={'【BTC Covered Call Recurring Strategy】'}
      investCurrency={CURRENCIES['USDT']}
      showCompoundWarning
    />
  )
}
