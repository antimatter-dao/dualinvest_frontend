import { styled, useTheme } from '@mui/material'
import { useActiveWeb3React } from 'hooks/'
import { getEtherscanLink } from 'utils'
import { ExternalLink } from 'theme/components'
import { useAllTransactions } from 'state/transactions/hooks'
import Spinner from 'components/Spinner'
import { ReactComponent as SuccessIcon } from 'assets/componentsIcon/statusIcon/success_icon.svg'
import { ReactComponent as Error } from 'assets/componentsIcon/statusIcon/error_icon.svg'

const TransactionStatusText = styled('div')({
  marginRight: 8,
  display: 'flex',
  alignItems: 'center',
  '& :hover': {
    texDecoration: 'underline'
  }
})

const TransactionState = styled(ExternalLink)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textDecoration: 'none !important',
  borderRadius: '0.5rem',
  padding: '0.25rem 0rem',
  fontWeight: 500,
  fontSize: '0.825rem'
}))

export default function Transaction({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const theme = useTheme()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId && !process.env.STORYBOOK_MODE) return null

  return (
    <div>
      <TransactionState href={chainId ? getEtherscanLink(chainId, hash, 'transaction') : ''}>
        <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        {pending ? (
          <Spinner />
        ) : success ? (
          <SuccessIcon height={16} width={16} fill={theme.palette.success.main} />
        ) : (
          <Error height={16} width={16} />
        )}
      </TransactionState>
    </div>
  )
}
