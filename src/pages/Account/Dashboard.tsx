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
import { Token, Currency } from 'constants/token'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as UpperRightIcon } from 'assets/componentsIcon/upper_right_icon.svg'
import { useAccountRecord } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import { BTC, USDT } from 'constants/index'
import Spinner from 'components/Spinner'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils/index'
import { usePrice } from 'hooks/usePriceSet'
import { useAccountBalances } from 'hooks/useAccountBalance'

enum BalanceTableHeaderIndex {
  token,
  available,
  amount,
  cumulativeInvest,
  pnl,
  actions
}

const RecordType: { [key in number]: 'withdraw' | 'deposit' } = {
  1: 'withdraw',
  2: 'deposit'
}

const BalanceTableHeader = ['Token', 'Available', 'Amount', 'Cumulative Invest', 'PnL', '']
const DetailTableHeader = ['Type', 'Token', 'Amount', 'Date']

function TokenHeader({ token }: { token: Currency }) {
  return (
    <Box display="flex" alignItems="center" gap={16}>
      <CurrencyLogo currency={token} size="32px" />
      <Box>
        <Typography fontSize={16}>{token.symbol}</Typography>
        <Typography fontSize={12} sx={{ opacity: 0.5 }}>
          {token.name}
        </Typography>
      </Box>
    </Box>
  )
}

export default function Dashboard() {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState<Token | undefined>(undefined)
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const [page, setPage] = useState(1)
  const btcPrice = usePrice('BTC', 30000)
  const accountBalances = useAccountBalances()
  const { accountRecord, pageParams } = useAccountRecord(page)

  const indexPrices = useMemo(() => {
    return {
      BTC: btcPrice
    }
  }, [btcPrice])

  const totalInvest = useMemo(() => {
    if (!accountBalances) return '-'
    const accumulated = Object.keys(accountBalances).reduce((acc: number, key: string) => {
      const val = accountBalances?.[key as keyof typeof accountBalances]?.totalInvest
      const price = indexPrices[key as keyof typeof indexPrices]
      if (val && price) {
        return acc + +val * +price
      } else {
        return acc
      }
    }, 0)
    return accumulated.toFixed(2) + ''
  }, [accountBalances, indexPrices])

  const accountDetailsData = useMemo(() => {
    const records = accountRecord?.records
    if (!records) return []

    return records.map(record => {
      const scanLink = chainId ? getEtherscanLink(chainId, record.hash, 'transaction') : ''
      const token = chainId ? new Token(chainId, record.currency, 18, record.symbol) : undefined

      return [
        <TransactionTypeIcon key="type" txType={RecordType[record.type]} />,
        <Box key={1} display="flex" gap={10} alignItems="center">
          <CurrencyLogo currency={token} size="16px" />
          {record.symbol}
        </Box>,
        <Box key={1} display="flex" alignItems="center">
          <ExternalLink
            href={scanLink}
            sx={{
              display: 'flex',
              color: theme => theme.palette.text.primary,
              '&:hover': {
                color: theme => theme.palette.primary.main
              }
            }}
          >
            <Typography component="span" sx={{}}>
              ${record.amount}
            </Typography>
            <Box component="span" sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
              <UpperRightIcon style={{ color: 'currentColor' }} />
            </Box>
          </ExternalLink>
        </Box>,
        dayjs(+record.timestamp * 1000).format('MMM DD, YYYY hh:mm:ss A'),
        <>{!isDownMd && <StatusTag key="status" status="completed" />}</>
      ]
    })
  }, [accountRecord?.records, chainId, isDownMd])

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

  const balanceData = useMemo(() => {
    return accountBalances
      ? [
          [
            <TokenHeader key="btc" token={BTC} />,
            accountBalances?.BTC?.availableBalance ?? '-',
            accountBalances?.BTC?.lockedBalance ?? '-',
            accountBalances?.BTC?.totalInvest ?? '-',
            accountBalances?.BTC?.earned ?? '-',
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
              buyHref="https://www.pancakeswap.finance/swap?outputCurrency=0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"
            />
          ],
          [
            <TokenHeader key="usdt" token={USDT} />,
            accountBalances?.USDT?.availableBalance ?? '-',
            accountBalances?.USDT?.lockedBalance ?? '-',
            accountBalances?.USDT?.totalInvest ?? '-',
            accountBalances?.USDT?.earned ?? '-',
            <BalanceActions
              key="1"
              onDeposit={() => {
                setCurrentCurrency(USDT)
                handleDepositOpen()
              }}
              onWithdraw={() => {
                setCurrentCurrency(USDT)
                handleWithdrawOpen()
              }}
              buyHref="https://www.pancakeswap.finance/swap?outputCurrency=0x55d398326f99059ff775485246999027b3197955"
            />
          ]
        ]
      : []
  }, [accountBalances, handleDepositOpen, handleWithdrawOpen])

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
                  <InvestmentValueCard
                    value={totalInvest}
                    unit="$"
                    // dayChange="+ 8.91% / $350.28 "
                  />
                ) : (
                  <NumericalCard
                    value={totalInvest}
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
                      perPage={pageParams?.perPage}
                      boundaryCount={0}
                      total={pageParams.total}
                      onChange={(event, value) => setPage(value)}
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
    <Box mt={24} display="grid" gap={8}>
      {data.map((dataRow, idx) => (
        <Card color="#F2F5FA" padding="17px 16px" key={`balance-row-${idx}`}>
          <Box display="grid" gap={20}>
            {dataRow[BalanceTableHeaderIndex.token]}
            {dataRow[BalanceTableHeaderIndex.actions]}
          </Box>

          <Box display="flex" flexDirection="column" gap={16} mt={24}>
            {dataRow.map((datum, idx2) => {
              if (idx2 === BalanceTableHeaderIndex.token) return null
              if (idx2 === BalanceTableHeaderIndex.actions) return null
              return (
                <Box key={`balance-row-${idx}-datum-${idx2}`} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {BalanceTableHeader[idx2]}
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
    </Box>
  )
}

function AccountDetailCards({ data }: { data: any[][] }) {
  return (
    <Box display="flex" flexDirection="column" gap={8} mb={24}>
      {data.map((dataRow, idx) => (
        <Card color="#F2F5FA" padding="17px 16px" key={`detail-row-${idx}`}>
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx2) => {
              return (
                <Box key={`detail-row-${idx}-datum-${idx2}`} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }} component="div">
                    {DetailTableHeader[idx2]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600} component="div">
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
    </Box>
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
        Swap
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
