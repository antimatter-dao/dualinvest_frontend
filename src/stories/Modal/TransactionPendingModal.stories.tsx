import Button from 'components/Button/Button'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/TransactionPendingModal',
  component: TransacitonPendingModal
}

export const Default = () => {
  const { showModal } = useModal()
  return <Button onClick={() => showModal(<TransacitonPendingModal />)}>Click to open transaction pending modal</Button>
}
