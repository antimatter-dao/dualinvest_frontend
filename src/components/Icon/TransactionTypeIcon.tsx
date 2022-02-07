import { Box } from '@mui/material'
import { ReactComponent as WithdrawIcon } from 'assets/svg/withdraw.svg'
import { ReactComponent as DepositIcon } from 'assets/svg/deposit.svg'

interface Props {
  txType: 'withdraw' | 'deposit' | 'vault withdraw' | 'vault deposit'
}

export default function TransactionTypeIcon(props: Props) {
  const { txType } = props

  switch (txType) {
    case 'withdraw':
      return (
        <Box>
          <WithdrawIcon /> Withdraw
        </Box>
      )
    case 'deposit':
      return (
        <Box>
          <DepositIcon /> Deposit
        </Box>
      )
    case 'vault withdraw':
      return (
        <Box>
          <WithdrawIcon /> Vault Withdraw
        </Box>
      )
    case 'vault deposit':
      return (
        <Box>
          <DepositIcon /> Vault Deposit
        </Box>
      )
    default:
      return <Box>undefined</Box>
  }
}
