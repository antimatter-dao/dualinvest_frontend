import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import { Token } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface Props {
  isOpen: boolean
  onDismiss?: () => void
  onConfirm?: () => void
  amount: string
  currency: Token | undefined
}

export default function RedeemConfirmModal({ isOpen, onDismiss, onConfirm, amount, currency }: Props) {
  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} padding="35px 52px 36px" closeIcon>
      <Typography fontSize={20} textAlign="center">
        Redeem Confirm
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          border: theme => `1px solid ${theme.palette.primary.main}`,
          height: 38,
          borderRadius: '8px',
          mt: 20
        }}
      >
        <InfoOutlinedIcon sx={{ color: theme => theme.palette.primary.main, height: 12 }} />
        <Typography fontSize={12} sx={{ opacity: 0.5 }}>
          The redemption amount will be returned to your account balance
        </Typography>
      </Box>
      <Typography fontSize={18} fontWeight={400} sx={{ opacity: 0.4 }} mt={32}>
        Redeem Amount
      </Typography>

      <Box display="flex" justifyContent="space-between" mt={18} mb={33} alignItems={'center'}>
        <Typography fontSize={44} fontWeight={400}>
          {amount}
        </Typography>

        {currency && (
          <Box display="flex" gap="5px">
            <CurrencyLogo currency={currency} />
            <Typography fontSize={24}>{currency.symbol}</Typography>
          </Box>
        )}
      </Box>

      <Button onClick={onConfirm} height="60px">
        Confirm
      </Button>
    </Modal>
  )
}
