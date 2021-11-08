import { useTheme, Box, Typography } from '@mui/material'
import Spinner from 'components/Spinner'
import Modal from '../index'

export default function TransacitonPendingModal({ pendingText }: { pendingText?: string }) {
  const theme = useTheme()
  return (
    <Modal closeIcon>
      <Box display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        <Spinner size="40px" />
        <Typography fontWeight={400} fontSize={18}>
          Waiting For Confirmation
        </Typography>
        <Typography fontWeight={400} fontSize={14} textAlign="center" color={theme.textColor.text3}>
          {pendingText || 'Please initiate transaction in your wallet'}
        </Typography>
      </Box>
    </Modal>
  )
}
