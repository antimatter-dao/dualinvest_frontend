import { Box } from '@mui/material'
import Button from 'components/Button/Button'
import Modal from 'components/Modal'

export default function ConfirmModal({
  isOpen,
  onDismiss,
  onConfirm
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
}) {
  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} closeIcon>
      <Box padding="24px">
        confirm subscribe
        <Button onClick={onConfirm}>Confirm</Button>
      </Box>
    </Modal>
  )
}
