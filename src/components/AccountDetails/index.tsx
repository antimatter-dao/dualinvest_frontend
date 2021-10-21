import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Typography, Box } from '@material-ui/core'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { shortenAddress } from '../../utils'
import Copy from 'components/Copy'
import Transaction from './Transaction'

import { SUPPORTED_WALLETS } from '../../constants'
import { injected, walletconnect, walletlink, fortmatic, portis } from '../../connectors'
import CoinbaseWalletIcon from 'assets/wallet/coinbaseWalletIcon.svg'
import WalletConnectIcon from 'assets/wallet/walletConnectIcon.svg'
import FortmaticIcon from 'assets/wallet/fortmaticIcon.png'
import PortisIcon from 'assets/wallet/portisIcon.png'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import { Text } from 'rebass'
import SecondaryButton from 'components/Button/SecondaryButton'
import TextButton from 'components/Button/TextButton'

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-template-rows: 50px 20px 20px;
  grid-row-gap: 12px;
  margin-bottom: 20px;
  justify-content: center;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > div {
    margin: 0 auto;
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`
const Dot = styled.span`
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ffffff 4.17%, rgba(255, 255, 255, 0) 75%);
  border: 0.6px solid #ffffff;
  box-sizing: border-box;
  border-radius: 50%;
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions
}: AccountDetailsProps) {
  const { chainId, account, connector } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Text fontSize=" 0.825rem" fontWeight={500}>
        Connected with {name}
      </Text>
    )
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Dot />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <img src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <img src={PortisIcon} alt={'portis logo'} />
            <Button
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </Button>
          </IconWrapper>
        </>
      )
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <>
      <UpperSection>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div style={{ marginRight: '8px' }}>
                  {connector !== injected && connector !== walletlink && (
                    <SecondaryButton
                      onClick={() => {
                        ;(connector as any).close()
                      }}
                    >
                      <Text fontSize="18px" fontWeight={400}>
                        Disconnect
                      </Text>
                    </SecondaryButton>
                  )}
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {account && shortenAddress(account)}</p>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <AccountControl>
                  {account && (
                    <Copy toCopy={account}>
                      <Typography variant="body2">Copy Address</Typography>
                    </Copy>
                  )}
                </AccountControl>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      <Box display="flex" gridGap="10px" width="100%" justifyContent="center">
        <OutlineButton onClick={toggleWalletModal} primary>
          Close
        </OutlineButton>
        <Button
          onClick={() => {
            openOptions()
          }}
        >
          Change
        </Button>
      </Box>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <Box display="grid" gridGap="16px" width="100%">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography>Recent Transactions</Typography>
            <TextButton onClick={clearAllTransactionsCallback}>(clear all)</TextButton>
          </Box>
          <Box display="grid">
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </Box>
        </Box>
      ) : (
        <Box display="flex" width="100%" justifyContent="center" marginTop={1}>
          <Typography> Your transactions will appear here...</Typography>
        </Box>
      )}
    </>
  )
}
