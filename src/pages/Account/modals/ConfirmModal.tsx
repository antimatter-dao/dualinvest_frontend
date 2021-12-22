import { Box, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'

export default function ConfirmModal({
  onDismiss,
  isOpen,
  children,
  actionStr
}: {
  onDismiss: () => void
  isOpen: boolean
  children: React.ReactNode
  actionStr: string
}) {
  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="22px 32px" display="grid" gap="32px">
        <Typography
          fontSize={20}
          fontWeight={{ xs: 700, sm: 400 }}
          sx={{ color: theme => ({ xs: theme.palette.text.primary, sm: theme.palette.text.secondary }) }}
        >
          Confirm {actionStr}
        </Typography>
        <Box>{children}</Box>
        <Box>
          <Box display={{ xs: 'grid', sm: 'flex' }} gap="16px">
            <OutlineButton onClick={onDismiss} primary>
              Cancel
            </OutlineButton>
            <Button onClick={onDismiss}>Confirm</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
