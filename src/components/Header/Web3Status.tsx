import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, styled } from '@mui/material'
// import { CountUp } from 'use-count-up'
// import { Activity } from 'react-feather'
import Copy from 'components/essential/Copy'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
// import { TokenAmount } from 'constants/token'
// import { useAggregateUniBalance } from 'state/wallet/hooks'
// import usePrevious from '../../hooks/usePrevious'
// import Divider from 'components/Divider'
import TextButton from 'components/Button/TextButton'
import Button from 'components/Button/Button'
// import { ReactComponent as UcenterIcon } from 'assets/svg/ucenter.svg'
// import { useHistory } from 'react-router'
// import { UserInfoTabRoute, UserInfoTabs } from 'pages/Account'

const UserButtonWrap = styled('div')({
  marginLeft: '5px',
  position: 'relative',
  width: 36,
  height: 36,
  '& > div': {
    opacity: 0,
    visibility: 'hidden'
  },
  '&:hover': {
    '& > div': {
      opacity: 1,
      visibility: 'visible'
    }
  }
})

// const UserMenuWrapper = styled('div')({
//   position: 'absolute',
//   top: '50px',
//   right: 0,
//   zIndex: 2000,
//   minWidth: '15rem',
//   boxSizing: 'border-box',
//   backgroundColor: '#ffffff',
//   overflow: 'hidden',
//   borderRadius: '16px',
//   transitionDuration: '0.3s',
//   transitionProperty: 'visibility, opacity',
//   display: 'flex',
//   border: '1px solid #ededed',
//   flexDirection: 'column',
//   '& > div:first-child': {
//     padding: '16px 24px',
//     display: 'flex',
//     alignItems: 'center',
//     borderBottom: '1px solid #ededed',
//     width: '100%'
//   },
//   '& > button:last-child': {
//     padding: '16px 24px',
//     borderTop: '1px solid #ededed'
//   }
// })

// const UserMenuItem = styled('button')({
//   padding: '12px 24px',
//   width: '100%',
//   border: 'none',
//   backgroundColor: 'transparent',
//   textAlign: 'left',
//   fontSize: '16px',
//   cursor: 'pointer',
//   '&:hover': {
//     backgroundColor: '#ededed'
//   }
// })

const ActionButton = styled(Button)(({ theme }) => ({
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

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

function Web3StatusInner() {
  const { account, error } = useWeb3React()
  // const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  // const history = useHistory()
  // const toShowUserPanel = useCallback(() => {
  //   history.push('/profile')
  //   return
  // }, [history])

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  if (account) {
    return (
      <Box
        sx={{
          height: '36px',
          display: 'flex',
          pl: '10px',
          borderRadius: '32px',
          fontSize: 14,
          lineHeight: '16px',
          background: 'rgba(255,255,255,0.1)',
          alignItems: 'center'
        }}
      >
        {/* {!!account && aggregateBalance && (
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
        )} */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: {
              xs: '0 0 0 8px',
              md: '0 0 0 10px'
            },
            gap: 10
          }}
        >
          {hasPendingTransactions ? (
            <Box
              sx={{
                margin: '0 auto',
                gap: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Spinner color={theme.textColor.text1} size="16px" />
              <Box
                component="span"
                sx={{
                  mr: {
                    xs: '8px',
                    md: '10px'
                  }
                }}
              >
                {pending?.length} Pending
              </Box>
            </Box>
          ) : (
            <>
              {hasSocks ? SOCK : null}
              <TextButton onClick={toggleWalletModal} fontSize={14} opacity={0.5}>
                {ENSName || shortenAddress(account)}
              </TextButton>
              {account && <Copy toCopy={account}></Copy>}
            </>
          )}
          <UserButtonWrap>
            {/* <UserButton id="userButton" onClick={toShowUserPanel} isOpen={!!match}>
                  <AntimatterIcon />
                </UserButton> */}
            {/* <UcenterIcon onClick={toShowUserPanel} style={{ width: 36, position: 'absolute', cursor: 'pointer' }} /> */}
            {/* <UserMenu account={account} /> */}
          </UserButtonWrap>
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <ActionButton width="140px" height="36px" onClick={toggleWalletModal}>
        {/* <Activity size={16} style={{ marginRight: 10 }} /> */}
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </ActionButton>
    )
  } else {
    return (
      <ActionButton width="140px" height="36px" onClick={toggleWalletModal}>
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

// function UserMenu({ account }: { account?: string | null }) {
//   const toggleWalletModal = useWalletModalToggle()
//   const history = useHistory()

//   return (
//     <UserMenuWrapper>
//       <div>
//         <UcenterIcon style={{ width: 24 }} />
//         <TextButton fontSize={14} opacity={0.5} style={{ margin: '0 15px', color: '#000' }}>
//           {account && shortenAddress(account)}
//         </TextButton>
//         {account && <Copy toCopy={account} />}
//       </div>
//       <Box display="flex" flexDirection="column">
//         <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.INVENTORY)}>
//           {UserInfoTabRoute[UserInfoTabs.INVENTORY]}
//         </UserMenuItem>
//         <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.ACTIVITY)}>
//           {UserInfoTabRoute[UserInfoTabs.ACTIVITY]}
//         </UserMenuItem>
//         <UserMenuItem onClick={toggleWalletModal}>Wallet</UserMenuItem>
//       </Box>
//     </UserMenuWrapper>
//   )
// }
