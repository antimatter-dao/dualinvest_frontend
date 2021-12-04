import { Box } from '@mui/material'
import { ReactComponent as WithdrawIcon } from 'assets/svg/withdraw.svg'
import { ReactComponent as DepositIcon } from 'assets/svg/deposit.svg'

interface Props {
  type: string
}
export default function TransactionType(props: Props) {
  const { type } = props

  switch (type) {
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
    default:
      return <Box>undefined</Box>
  }
}
