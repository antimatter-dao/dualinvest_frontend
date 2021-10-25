import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, makeStyles } from '@material-ui/core'
import { CountUp } from 'use-count-up'
import { Activity } from 'react-feather'
import Copy from 'components/Copy'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
import { TokenAmount } from 'constants/token'
import { useAggregateUniBalance } from 'state/wallet/hooks'
import usePrevious from '../../hooks/usePrevious'
import Divider from 'components/Divider'
import useBreakpoint from 'hooks/useBreakpoint'
import TextButton from 'components/Button/TextButton'
import Button from 'components/Button/Button'

const useStyles = makeStyles(theme => ({
  actionButton: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 320,
      width: '100%',
      borderRadius: 49,
      height: 40
    }
  },
  dot: {
    width: 12,
    height: 12,
    background: `linear-gradient(135deg, #ffffff 4.17%, rgba(255, 255, 255, 0) 75%)`,
    border: '0.6px solid #ffffff',
    boxSizing: 'border-box',
    borderRadius: '50%'
  }
}))

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()
  const isDownMD = useBreakpoint('md')
  const classes = useStyles()
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  if (account) {
    return (
      <Box
        height={'32px'}
        display={'flex'}
        border={'1px solid #FFFFFF'}
        borderRadius={'4px'}
        alignItems={'center'}
        style={{ fontSize: 14 }}
      >
        {!!account && aggregateBalance && (
          <>
            <Box padding={isDownMD ? '0 8px' : '0 10px 0 12px'} gridGap={10}>
              <CountUp
                key={countUpValue}
                isCounting
                start={parseFloat(countUpValuePrevious)}
                end={parseFloat(countUpValue)}
                thousandsSeparator={','}
                duration={1}
              />

              <span style={{ marginLeft: 10 }}>MATTER</span>
            </Box>
            <Divider orientation={'vertical'} />
          </>
        )}
        <Box display="flex" alignItems="center" padding={isDownMD ? '0 8px' : '0 12px 0 10px'} gridGap={10}>
          {hasPendingTransactions ? (
            <>
              <Spinner color={theme.textColor.text1} size="16px" />
              <span>{pending?.length} Pending</span>
            </>
          ) : (
            <>
              {hasSocks ? SOCK : null}
              {!hasPendingTransactions && connector && <span className={classes.dot} />}
              <TextButton onClick={toggleWalletModal} fontSize={12} opacity={0.6}>
                {ENSName || shortenAddress(account)}
              </TextButton>
              {account && <Copy toCopy={account}></Copy>}
            </>
          )}
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <Button
        backgroundColor={theme.palette.error.main}
        classname={classes.actionButton}
        fontSize={'14px'}
        width={'140px'}
        height={'32px'}
        onClick={toggleWalletModal}
      >
        <Activity size={16} style={{ marginRight: 10 }} />
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </Button>
    )
  } else {
    return (
      <Button
        classname={classes.actionButton}
        fontSize={'14px'}
        width={'140px'}
        height={'32px'}
        onClick={toggleWalletModal}
      >
        Connect Wallet
      </Button>
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
