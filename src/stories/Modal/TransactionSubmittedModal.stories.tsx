import { ComponentMeta } from '@storybook/react'
import Button from 'components/Button/Button'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'

export default {
  title: 'Modal/TransactionSubmittedModal',
  component: TransactionSubmittedModal
} as ComponentMeta<typeof TransactionSubmittedModal>

export const Default = () => {
  const { showModal } = useModal()
  return (
    <Button onClick={() => showModal(<TransactionSubmittedModal />)}>Click to open transaction submitted modal</Button>
  )
}

export const WithText = () => {
  const { showModal } = useModal()
  return (
    <Button onClick={() => showModal(<TransactionSubmittedModal>test test test test</TransactionSubmittedModal>)}>
      Click to open transaction submitted modal with text
    </Button>
  )
}
