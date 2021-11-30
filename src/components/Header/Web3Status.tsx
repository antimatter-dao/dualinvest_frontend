import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, styled, Typography } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
import { BlackButton } from 'components/Button/Button'
import { ReactComponent as Web3StatusIcon } from 'assets/svg/web3status_icon.svg'

const ActionButton = styled(BlackButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  fontSize: '14px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 320,
    width: '100%',
    borderRadius: 49,
    height: '40px'
  }
}))

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, error } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()

  if (account) {
    return (
      <Box sx={{ cursor: 'pointer' }} style={{ marginBottom: 15 }} onClick={toggleWalletModal}>
        <Box
          sx={{
            height: 36,
            width: 180,
            borderRadius: '46px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            mt: 8
          }}
        >
          <div />
          {hasPendingTransactions ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 17, ml: 20 }}>
              <Spinner color={theme.palette.text.primary} size="16px" />
              <Box component="span" sx={{ ml: 3 }}>
                <Typography sx={{ fontSize: 14, ml: 8, color: theme.palette.text.primary }}>
                  {pending?.length} Pending
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 14, mr: 17, ml: 20, color: theme.palette.text.primary }}>
              {ENSName || shortenAddress(account)}
            </Typography>
          )}
          <Web3StatusIcon />
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <ActionButton width="140px" height="36px" style={{ marginBottom: 15 }} onClick={toggleWalletModal}>
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </ActionButton>
    )
  } else {
    return (
      <ActionButton width="140px" height="36px" style={{ marginBottom: 15 }} onClick={toggleWalletModal}>
        Connect Wallet
      </ActionButton>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
