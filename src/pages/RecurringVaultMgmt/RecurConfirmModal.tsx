import { Typography } from '@mui/material'
import Modal from 'components/Modal'
import Button from 'components/Button/Button'

interface Props {
  isOpen: boolean
  onDismiss?: () => void
  onConfirm?: () => void
  type: 'on' | 'off'
}

export default function RecurConfirmModal(props: Props) {
  const { isOpen, onDismiss, onConfirm, type } = props

  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} closeIcon padding="35px 32px 53px">
      <Typography fontSize={20} textAlign="center">
        {type === 'on' ? 'Recurring Confirm' : 'Stop Recurring'}
      </Typography>
      <Typography fontSize={16} fontWeight={500} mt={44} mb={32} textAlign="center">
        When you stop recurring, all your existing orders will not be taken into next cycle and you can redeem your
        tokens once your existing orders expire.
      </Typography>
      <Button onClick={onConfirm} height="60px">
        Confirm
      </Button>
    </Modal>
  )
}
