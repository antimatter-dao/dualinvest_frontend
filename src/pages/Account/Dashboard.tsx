import { useCallback, useMemo, useState } from 'react'
import { Container, Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card/Card'
import Table from 'components/Table'
import NoDataCard from 'components/Card/NoDataCard'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalCard from 'components/Card/NumericalCard'
import PaginationView from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'
import ActionModal, { ActionType } from './ActionModal'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Token, TokenAmount } from 'constants/token'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useDualInvestCallback } from 'hooks/useDualInvest'
import useModal from 'hooks/useModal'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router'
import useBreakpoint from 'hooks/useBreakpoint'
import CurrencyLogo from 'components/essential/CurrencyLogo'

const accountDetailsData = [['Withdraw', 'BTC', '1.087062', 'Sep 21, 2021  10:42:21 AM ']]

const BTC = new Token(3, '0x9c1CFf4E5762e8e1F95DD3Cc74025ba8d0e71F93', 18, 'BTC', 'btc_token')

export default function Dashboard() {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState<Token | undefined>(undefined)

  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const history = useHistory()
  const { showModal, hideModal } = useModal()
  const { depositCallback, withdrawCallback } = useDualInvestCallback()
  const addTransaction = useTransactionAdder()
  const isDownMd = useBreakpoint('md')

  const handleDepositOpen = useCallback(() => {
    setIsDepositOpen(true)
  }, [])

  const handleWithdrawOpen = useCallback(() => {
    setIsWithdrawOpen(true)
  }, [])

  const handleDismiss = useCallback(() => {
    setIsDepositOpen(false)
    setIsWithdrawOpen(false)
    setCurrentCurrency(undefined)
  }, [])

  const handleDeposit = useCallback(
    (val: string | undefined, token: Token, setHash: (hash: string) => void, onError: (e: Error) => void) => {
      if (!depositCallback || !val || !account) return
      showModal(<TransacitonPendingModal />)
      depositCallback(val, token.address, { gasLimit: 3000000 })
        .then(r => {
          hideModal()
          setHash(r.hash)
          const tokenAmount = new TokenAmount(token, val)
          addTransaction(r, {
            summary: `Deposit ${tokenAmount.toExact()} ${token.symbol}`
          })
        })
        .catch(onError)
    },
    [depositCallback, account, showModal, hideModal, addTransaction]
  )

  const handleWithdraw = useCallback(
    (val: string | undefined, token: Token, setHash: (hash: string) => void, onError: (e: Error) => void) => () => {
      if (!withdrawCallback || !val || !account) return
      showModal(<TransacitonPendingModal />)
      withdrawCallback()
        .then(r => {
          hideModal()
          setHash(r.hash)
          const tokenAmount = new TokenAmount(token, val)
          addTransaction(r, {
            summary: `Withdraw ${tokenAmount.toExact()} ${token.symbol}`
          })
        })
        .catch(onError)
    },
    [withdrawCallback, account, showModal, hideModal, addTransaction]
  )

  const balanceActions = useMemo(() => {
    return (
      <Box display="flex" key="action" gap={10}>
        <Button
          fontSize={14}
          style={{ maxWidth: 92, borderRadius: 4, height: 36 }}
          onClick={() => {
            setCurrentCurrency(BTC)
            handleDepositOpen()
          }}
        >
          Deposit
        </Button>
        <Button
          fontSize={14}
          style={{ maxWidth: 92, borderRadius: 4, height: 36 }}
          onClick={() => {
            setCurrentCurrency(BTC)
            handleWithdrawOpen()
          }}
        >
          Withdraw
        </Button>
        <OutlineButton
          href=""
          fontSize={14}
          style={{ maxWidth: 92, borderRadius: 4, height: 36, backgroundColor: '#ffffff' }}
          primary
        >
          Buy
        </OutlineButton>
      </Box>
    )
  }, [])

  const balanceData = useMemo(() => [['BTC', '0.286952', '1.286952', '0.286952', '0.286952', balanceActions]], [
    handleDepositOpen,
    handleWithdrawOpen
  ])

  const balanceDataIsDownMd: any = {
    ['Available']: 0.28692,
    ['Amount']: 1.28695,
    ['Cumulative Invest']: 0.28692,
    ['PnL']: 0.28692
  }

  const AccountBalanceCard = useMemo(() => {
    return (
      <Card color="#F2F5FA" padding="17px 16px">
        <Box mb={20} display="flex" gap={16} alignItems="center">
          <CurrencyLogo currency={BTC} />
          <Box>
            <Typography fontSize={16}>{BTC.symbol}</Typography>
            <Typography fontSize={12} sx={{ opacity: 0.5 }}>
              {BTC.name}
            </Typography>
          </Box>
        </Box>
        {balanceActions}
        <Box display="flex" flexDirection="column" gap={16} mt={24}>
          {Object.keys(balanceDataIsDownMd).map((key, idx) => (
            <Box key={idx} display="flex" justifyContent="space-between">
              <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                {key}
              </Typography>
              <Typography fontSize={12} fontWeight={600}>
                {balanceDataIsDownMd[key]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    )
  }, [])

  if (!account)
    return (
      <Container sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <>
      <ActionModal
        isOpen={isDepositOpen}
        onDismiss={handleDismiss}
        onAction={handleDeposit}
        token={currentCurrency}
        type={ActionType.DEPOSIT}
      >
        <Box display="flex" mt={-20}>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            Please make sure there is a certain amount of {currentCurrency?.symbol ?? 'ETH'} in the wallet balance,
            otherwise the deposit will fail due to insufficient handling fees.
          </Typography>
        </Box>
      </ActionModal>
      <ActionModal
        isOpen={isWithdrawOpen}
        onDismiss={handleDismiss}
        type={ActionType.WITHDRAW}
        token={currentCurrency}
        onAction={handleWithdraw}
      />
      <Container sx={{ mt: 48 }}>
        <Box display="grid" gap={48}>
          <Card>
            <Box padding="38px 24px" display="grid" gap={36}>
              <Box>
                <Typography fontSize={24} fontWeight={700}>
                  My Account Balance
                </Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary, mt: 8 }}>
                  Deposit funds to your Dual Investment account, you can withdraw available amount at any time
                </Typography>
              </Box>
              <NumericalCard
                value={'1,908.12'}
                border
                title="Portfolio Value"
                unit="$"
                padding="20px 24px"
                fontSize={'44px'}
              >
                <Button
                  onClick={() => {
                    history.push(routes.dualInvest)
                  }}
                  style={{ position: 'absolute', right: '24px', bottom: '20px', height: 44, fontSize: 14 }}
                  width="148px"
                >
                  Invest
                </Button>
              </NumericalCard>
              {balanceData && isDownMd ? (
                AccountBalanceCard
              ) : balanceData ? (
                <Table header={['Token', 'Available', 'Amount', 'Cumulative Invest', 'PnL', '']} rows={balanceData} />
              ) : (
                <NoDataCard height="20vh" />
              )}
            </Box>
          </Card>

          <Card>
            <Box padding="38px 24px" display="grid" gap={36}>
              <Typography fontSize={24} fontWeight={700}>
                Account Details
              </Typography>
              {accountDetailsData ? (
                <>
                  <Table header={['Type', 'Token', 'Amount', 'Date', '']} rows={accountDetailsData} />
                  <PaginationView count={4} page={1} setPage={() => {}} />
                </>
              ) : (
                <NoDataCard height="20vh" />
              )}
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  )
}
