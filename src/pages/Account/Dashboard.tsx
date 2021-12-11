import { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { Container, Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card/Card'
import Table from 'components/Table'
import NoDataCard from 'components/Card/NoDataCard'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalCard from 'components/Card/NumericalCard'
import Pagination from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'
import ActionModal, { ActionType } from './ActionModal'
import StatusTag from 'components/Status/StatusTag'
import TransactionTypeIcon from 'components/Icon/TransactionTypeIcon'
import { Token } from 'constants/token'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as UpperRightIcon } from 'assets/componentsIcon/upper_right_icon.svg'
import { useAccountRecord } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import { BTC } from 'constants/index'
import Spinner from 'components/Spinner'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils/index'

enum BalanceTableHeaderIndex {
  token,
  available,
  amount,
  cumulativeInvest,
  pnl,
  actions
}

enum DetailsTableHeaderIndex {
  type,
  token,
  amount,
  date
}

const RecordType: { [key in number]: 'withdraw' | 'deposit' } = {
  1: 'withdraw',
  2: 'deposit'
}

const BalanceTableHeader = ['Token', 'Available', 'Amount', 'Cumulative Invest', 'PnL', '']
const DetailTableHeader = ['Type', 'Token', 'Amount', 'Date']

export default function Dashboard() {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState<Token | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const [page, setPage] = useState(1)

  const { accountRecord, pageParams } = useAccountRecord()

  const accountDetailsData = useMemo(() => {
    const records = accountRecord?.records
    if (!records) return []

    return records.map(record => {
      const timestamp = parseInt(record.timestamp) * 1000
      const scanLink = chainId ? getEtherscanLink(chainId, record.hash, 'transaction') : ''

      return [
        <TransactionTypeIcon key="type" txType={RecordType[record.type]} />,
        <Box key={1} display="flex" gap={10} alignItems="center">
          <CurrencyLogo currency={BTC} />
          <Typography fontSize={16}>{BTC.symbol}</Typography>
        </Box>,
        <Box key={1} display="flex" alignItems="center">
          <Typography component="span">${record.amount}</Typography>
          <Box component="span" sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
            <ExternalLink href={scanLink}>
              <UpperRightIcon />
            </ExternalLink>
          </Box>
        </Box>,
        dayjs(timestamp).format('MMM DD, YYYY hh:mm:ss A'),
        <StatusTag key="status" status="completed" />
      ]
    })
  }, [accountRecord])

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

  const balanceData = useMemo(
    () => [
      [
        'BTC',
        '0.286952',
        '1.286952',
        '0.286952',
        '0.286952',
        <BalanceActions
          key="1"
          onDeposit={() => {
            setCurrentCurrency(BTC)
            handleDepositOpen()
          }}
          onWithdraw={() => {
            setCurrentCurrency(BTC)
            handleWithdrawOpen()
          }}
          buyHref=""
        />
      ]
    ],
    [handleDepositOpen, handleWithdrawOpen]
  )

  if (!account)
    return (
      <Container disableGutters sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <>
      <ActionModal isOpen={isDepositOpen} onDismiss={handleDismiss} token={currentCurrency} type={ActionType.DEPOSIT} />
      <ActionModal
        isOpen={isWithdrawOpen}
        onDismiss={handleDismiss}
        type={ActionType.WITHDRAW}
        token={currentCurrency}
      />
      <Container disableGutters sx={{ mt: 48 }}>
        <Box display="grid" gap={48}>
          <Card>
            <Box padding="38px 24px" display="grid" gap={36}>
              <Box>
                <Typography fontSize={{ xs: 20, sm: 24 }} fontWeight={700}>
                  My Account Balance
                </Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary, mt: 8 }}>
                  Deposit funds to your Dual Investment account, you can withdraw available amount at any time
                </Typography>
              </Box>
              <Box position="relative">
                {!accountRecord && (
                  <Box
                    position="absolute"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: '#ffffff',
                      zIndex: 3,
                      borderRadius: 2
                    }}
                  >
                    <Spinner size={60} />
                  </Box>
                )}

                {isDownMd ? (
                  <InvestmentValueCard value={'1,908.12'} unit="$" dayChange="+ 8.91% / $350.28 " />
                ) : (
                  <NumericalCard
                    value={'1,908.12'}
                    border
                    title="Portfolio Value"
                    unit="$"
                    padding="20px 24px"
                    fontSize={'44px'}
                    // dayChange="+ 8.91% / $350.28 "
                  >
                    <Button
                      onClick={() => {
                        history.push(routes.dualInvest)
                      }}
                      style={{
                        position: 'absolute',
                        right: '24px',
                        bottom: '20px',
                        width: 148,
                        height: 44,
                        fontSize: 14
                      }}
                    >
                      Invest
                    </Button>
                  </NumericalCard>
                )}

                {balanceData && isDownMd ? (
                  <AccountBalanceCards data={balanceData} />
                ) : balanceData ? (
                  <Table header={BalanceTableHeader} rows={balanceData} />
                ) : (
                  <NoDataCard height="20vh" />
                )}
              </Box>
            </Box>
          </Card>

          <Card>
            <Box padding="38px 24px" display="grid" gap={36}>
              <Typography fontSize={24} fontWeight={700}>
                Account Details
              </Typography>
              <Box position="relative">
                {!accountRecord && (
                  <Box
                    position="absolute"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: '#ffffff',
                      zIndex: 3,
                      borderRadius: 2
                    }}
                  >
                    <Spinner size={60} />
                  </Box>
                )}

                {accountDetailsData.length > 0 ? (
                  <>
                    {isDownMd ? (
                      <AccountDetailCards data={accountDetailsData} />
                    ) : (
                      <Table header={DetailTableHeader} rows={accountDetailsData} />
                    )}

                    <Pagination
                      count={pageParams?.count}
                      page={page}
                      setPage={setPage}
                      perPage={pageParams?.perPage}
                      boundaryCount={0}
                      total={pageParams.total}
                    />
                  </>
                ) : (
                  <NoDataCard height="20vh" />
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  )
}

function AccountBalanceCards({ data }: { data: any[][] }) {
  return (
    <>
      {data.map((dataRow, idx) => (
        <Card color="#F2F5FA" padding="17px 16px" key={idx}>
          <Box mb={20} display="flex" gap={16} alignItems="center">
            <CurrencyLogo currency={BTC} />
            <Box>
              <Typography fontSize={16}>{BTC.symbol}</Typography>
              <Typography fontSize={12} sx={{ opacity: 0.5 }}>
                {BTC.name}
              </Typography>
            </Box>
          </Box>
          {dataRow[BalanceTableHeaderIndex.actions]}
          <Box display="flex" flexDirection="column" gap={16} mt={24}>
            {dataRow.map((datum, idx) => {
              if (idx === BalanceTableHeaderIndex.actions) return null
              return (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {BalanceTableHeader[idx]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600}>
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Card>
      ))}
    </>
  )
}

function AccountDetailCards({ data }: { data: any[][] }) {
  return (
    <>
      {data.map((dataRow, idx) => (
        <Card color="#F2F5FA" padding="17px 16px" key={idx}>
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx) => {
              return (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {DetailTableHeader[idx]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600}>
                    {idx === DetailsTableHeaderIndex.token && (
                      <span style={{ marginRight: 5 }}>
                        <CurrencyLogo currency={datum} size="12px" />
                      </span>
                    )}
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>
          <Box
            borderRadius={22}
            bgcolor="rgba(17, 191, 45, 0.16)"
            width="100%"
            height={36}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={20}
          >
            <Typography fontSize={14} color="#11BF2D" textAlign="center">
              Completed
            </Typography>
          </Box>
        </Card>
      ))}
    </>
  )
}

function BalanceActions({
  onDeposit,
  onWithdraw,
  buyHref
}: {
  onDeposit: () => void
  onWithdraw: () => void
  buyHref: string
}) {
  return (
    <Box display="flex" key="action" gap={10}>
      <Button fontSize={14} style={{ maxWidth: 92, borderRadius: 4, height: 36 }} onClick={onDeposit}>
        Deposit
      </Button>
      <Button fontSize={14} style={{ maxWidth: 92, borderRadius: 4, height: 36 }} onClick={onWithdraw}>
        Withdraw
      </Button>
      <OutlineButton
        href={buyHref}
        fontSize={14}
        style={{ maxWidth: 92, borderRadius: 4, height: 36, backgroundColor: '#ffffff' }}
        primary
      >
        Buy
      </OutlineButton>
    </Box>
  )
}

function InvestmentValueCard({ value, unit }: { value?: string; unit?: string; dayChange?: string }) {
  const theme = useTheme()
  const history = useHistory()
  return (
    <Card width={1} style={{ position: 'relative', border: '1px solid #00000010' }}>
      <Box
        sx={{
          padding: '16px',
          gap: '12px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display="flex">
          <Typography variant="inherit" color={theme.palette.text.secondary}>
            Total Investment Value
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            color: theme.palette.text.primary
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700, ml: 4, lineHeight: 1 }}>{unit}</Typography>
          {/* <Box
            component="div"
            borderRadius={22}
            color="#31B047"
            bgcolor="rgba(49, 176, 71, 0.16)"
            fontSize={14}
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={120}
            height={24}
            ml={12}
          >
            <Typography
              sx={{
                color: '#11BF2D',
                fontSize: '12px'
              }}
            >
              {dayChange}
            </Typography>
          </Box> */}
        </Box>
        <Button
          onClick={() => {
            history.push(routes.dualInvest)
          }}
          style={{ width: '100%', height: 36, fontSize: 14, borderRadius: 22 }}
        >
          Invest
        </Button>
      </Box>
    </Card>
  )
}
