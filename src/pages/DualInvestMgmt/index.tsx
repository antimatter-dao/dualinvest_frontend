import { useState, useRef, useMemo, useCallback } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Box, Typography, Grid, styled } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import { ReactComponent as RiskStatementIcon } from 'assets/svg/risk_statement.svg'
import { ReactComponent as Faq } from 'assets/svg/faq.svg'
import { routes } from 'constants/routes'
import theme from 'theme'
import Card, { OutlinedCard } from 'components/Card/Card'
import Accordion from 'components/Accordion'
import Divider from 'components/Divider'
import InputNumerical from 'components/Input/InputNumerical'
import { BlackButton } from 'components/Button/Button'
// import { SimpleProgress } from 'components/Progress'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import LineChart from 'components/Chart'
import { Time } from 'lightweight-charts'
import { useProduct } from 'hooks/useDualInvestData'
import { useActiveWeb3React } from 'hooks'
import { BTC } from 'constants/index'
import { Axios } from 'utils/axios'
import Spinner from 'components/Spinner'
import { useDualInvestBalance, useDualInvestCallback } from 'hooks/useDualInvest'
import { tryParseAmount } from 'utils/parseAmount'
import { useAddPopup, useWalletModalToggle } from 'state/application/hooks'
import ActionButton from 'components/Button/ActionButton'
import { InvesStatus, InvesStatusType, OrderRecord } from 'utils/fetch/product'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import ActionModal, { ActionType } from 'pages/Account/ActionModal'

enum ErrorType {
  insufficientBalance = 'Insufficient Balance',
  singleLimitExceed = 'Single Limit Exceeded'
}

const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '18px',
  color: '#808080',
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

const StyledOrderList = styled('ol')(({ theme }) => ({
  display: 'block',
  listStyle: 'none',
  counterReset: 'counterReset',
  position: 'relative',
  paddingLeft: 36,
  '& li': {
    paddingBottom: '24px'
  },
  '& li:before': {
    counterIncrement: 'counterReset',
    content: 'counter(counterReset)',
    color: theme.palette.primary.main,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid #31B047',
    float: 'left',
    textAlign: 'center',
    marginRight: 12,
    position: 'absolute',
    left: '-1px'
  }
}))

export default function DualInvestMgmt() {
  const [amount, setAmount] = useState('')
  const [pending, setPending] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [currentCurrency] = useState(BTC)

  const graphContainer = useRef<HTMLDivElement>(null)
  const node = useRef<any>()
  useOnClickOutside(node, () => setExpanded(null))

  const { id } = useParams<{ id: string }>()
  const { showModal } = useModal()
  const { account } = useActiveWeb3React()
  const balance = useDualInvestBalance(currentCurrency)
  const { createOrderCallback } = useDualInvestCallback()
  const product = useProduct(id)
  const toggleWallet = useWalletModalToggle()
  const addPopup = useAddPopup()

  const hideDeposit = useCallback(() => {
    setIsDepositOpen(false)
  }, [])
  const showDeposit = useCallback(() => {
    setIsDepositOpen(true)
  }, [])

  const data = useMemo(
    () => ({
      ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      ['Delivery Date']: product?.expiredAt ?? '-',
      // ['Current Progress']: 0.16,
      minAmount: product ? product.multiplier + ' ' + product.currency : '-',
      maxAmount: product ? +product.orderLimit * +product.multiplier + ' ' + product.currency : '-'
    }),
    [product]
  )

  const handleSubscribe = useCallback(async () => {
    if (!product || !amount || !createOrderCallback) return
    const val = tryParseAmount((+amount * +product?.multiplier).toString(), BTC)?.raw?.toString()
    if (!val) return
    try {
      setPending(true)
      const backendCall = await Axios.post<any>(
        'createOrder',
        {},
        {
          account,
          amount,
          product_id: id
        }
      )
      if (backendCall.data.code !== 200) throw Error('Backend Error')
      if (!backendCall.data.data) throw Error(backendCall.data.msg)
      const { orderId, productId } = backendCall.data.data
      await createOrderCallback(orderId, productId, val, BTC.address)
      let fail = 0
      const polling = new Promise((resolve, reject) => {
        const timeoutId = setInterval(() => {
          Axios.get<{ records: OrderRecord[] }>('getOrderRecord?orderId=' + orderId, { address: account })
            .then(r => {
              const statusCode = r.data.data.records[0].investStatus as keyof typeof InvesStatus
              if (InvesStatus[statusCode] === InvesStatusType.ERROR) {
                clearInterval(timeoutId)
                reject('Confirm Order fail')
              }
              if (InvesStatus[statusCode] === InvesStatusType.SUCCESS) {
                clearInterval(timeoutId)
                resolve(() => {})
              }
            })
            .catch((e: Error) => {
              if (fail > 6) {
                clearInterval(timeoutId)
                reject('Confirm Order fail')
                throw Error('Confirm Order fail:' + e)
              }
              fail++
            })
        }, 2000)
      })
      await polling

      addPopup(
        {
          txn: {
            success: true,
            summary: `Subscribe successful, order ID:${orderId}`
          }
        },
        orderId + ''
      )
      setPending(false)
    } catch (e) {
      setPending(false)
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message}</MessageBox>)
      console.error(e)
    }
  }, [account, addPopup, amount, createOrderCallback, id, product, showModal])

  const error = useMemo(() => {
    if (!product || !balance) return ''
    let str = ''
    if (amount !== '' && +balance < +amount * +product.multiplier) str = ErrorType.insufficientBalance
    if (amount !== '' && (+amount > +product?.orderLimit || +amount < 1)) str = ErrorType.singleLimitExceed
    return str
  }, [amount, balance, product])

  const strikeLineData = useMemo(() => {
    return product ? [{ time: (product.ts * 1000) as Time, value: +product.strikePrice }] : undefined
  }, [product])

  return (
    <>
      <ActionModal isOpen={isDepositOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <Box display="grid" width="100%" alignContent="flex-start" marginBottom="auto" justifyItems="center">
        <Box
          display="flex"
          alignItems="center"
          sx={{ width: '100%', background: theme.palette.background.paper, padding: '28px 165px' }}
        >
          <NavLink to={routes.dualInvest} style={{ textDecoration: 'none' }}>
            <ArrowLeft />
            <Typography component="span" color={theme.bgColor.bg1} fontSize={14} ml={16}>
              Back
            </Typography>
          </NavLink>
        </Box>
        <Box padding="60px 0" sx={{ maxWidth: theme.width.maxContent }} width="100%">
          <Box mb={60}>
            <Typography fontSize={44} fontWeight={700} component="span">
              BTC Financial Management
            </Typography>
            <Typography fontSize={44} fontWeight={400} component="span" ml={8}>
              [upward exercise]
            </Typography>
          </Box>
          <Grid container spacing={20}>
            <Grid xs={12} md={4} item position="relative">
              {!product && (
                <Box
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    top: 20,
                    left: 20,
                    width: 'calc(100% - 20px)',
                    height: 'calc(100% - 20px)',
                    background: '#ffffff',
                    zIndex: 3,
                    borderRadius: 2
                  }}
                >
                  <Spinner size={60} />
                </Box>
              )}
              <Card width="100%" padding="36px 24px">
                <Box display="flex" flexDirection="column" gap={20}>
                  {Object.keys(data).map((key, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between">
                      <Typography sx={{ opacity: 0.8 }}>{key}</Typography>
                      {/* {key === 'Current Progress' ? (
                      <SimpleProgress key={1} val={0.16} total={1} />
                    ) : ( */}
                      <Typography color={key === 'APY' ? theme.palette.primary.main : theme.palette.text.primary}>
                        {data[key as keyof typeof data]}
                      </Typography>
                      {/* )} */}
                    </Box>
                  ))}
                  <Divider extension={24} sx={{ opacity: 0.1 }} />
                  <Box>
                    <InputNumerical
                      disabled={!product || !account}
                      value={amount}
                      onMax={() => {
                        setAmount(balance ? `${+balance / (product ? +product?.multiplier : 1)}` : '')
                      }}
                      label={'Subscription Amount'}
                      onChange={e => setAmount(e.target.value)}
                      balance={balance || '-'}
                      unit={product?.currency ?? ''}
                      endAdornment={
                        <Typography noWrap fontSize={14} alignItems="center">
                          {product && product?.multiplier && product?.currency ? (
                            <>
                              {`X ${product?.multiplier} `}
                              <Typography component="span" sx={{ margin: '0 10px' }}>
                                =
                              </Typography>
                              <Typography component="span" color="primary">
                                {+product?.multiplier * +amount} {product?.currency}
                              </Typography>
                            </>
                          ) : (
                            ''
                          )}
                        </Typography>
                      }
                      onDeposit={showDeposit}
                      error={!!error}
                    />
                    <Box display="grid" mt={12}>
                      <Typography
                        fontSize={12}
                        sx={{ opacity: 0.5, display: 'flex', justifyContent: 'space-between', width: '100%' }}
                      >
                        <span>Min investment:</span>
                        <span>{data.minAmount} </span>
                      </Typography>
                      <Typography
                        fontSize={12}
                        sx={{ opacity: 0.5, display: 'flex', justifyContent: 'space-between', width: '100%' }}
                      >
                        <span>Max investment:</span>
                        <span>{data.maxAmount} </span>
                      </Typography>
                    </Box>
                  </Box>
                  {!account && <BlackButton onClick={toggleWallet}>Connect Wallet</BlackButton>}
                  {account && (
                    <ActionButton
                      pending={pending}
                      pendingText={'Pending'}
                      error={!amount ? 'Please Input Amount' : ''}
                      onAction={handleSubscribe}
                      actionText=" Subscribe"
                      disableAction={!product?.isActive ? true : !!error}
                      successText={'Ended'}
                      success={!product?.isActive}
                    />
                  )}
                  <Box display="flex">
                    <InfoOutlinedIcon
                      sx={{ color: error ? theme.palette.error.main : theme.palette.primary.main, height: 12 }}
                    />
                    <Typography component="p" fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
                      {error ? (
                        error === ErrorType.insufficientBalance ? (
                          <>
                            <Typography component="span" color="error" fontSize={12}>
                              Insufficient Balance.
                            </Typography>
                            Please recharge your account first before opening wealth management
                          </>
                        ) : (
                          <>
                            <Typography component="span" color="error" fontSize={12} sx={{ display: 'block' }}>
                              Single Limit Exceeded.
                            </Typography>
                            Single financial management limit is {product?.multiplier ?? '-'}～
                            {product ? +product?.orderLimit * +product?.multiplier : '-'} BTC
                          </>
                        )
                      ) : (
                        'Once subscribed the APY will get locked in, the product can&apos;t be cancelled after subscription.'
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid xs={12} md={8} item>
              <Card width="100%" padding="32px 24px" style={{ height: '100%' }}>
                <Box display="flex" flexDirection="column" gap="20px" maxWidth={'100%'} height="100%">
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={24} fontWeight={700}>
                      Purchase expected income graph
                    </Typography>
                  </Box>
                  <Box sx={{ maxWidth: '100vw', height: '100%', flexGrow: 1 }} ref={graphContainer}>
                    <LineChart
                      lineColor="#18A0FB"
                      lineSeriesData={[
                        { time: 16059744000000 as Time, value: 40000 },
                        { time: 16060608000000 as Time, value: 40000 },
                        { time: 16061472000000 as Time, value: 40000 },
                        { time: 16062336000000 as Time, value: 40000 },
                        { time: 16063200000000 as Time, value: 40000 }
                      ]}
                      unit="usdt"
                      id="incomeGraph"
                      height={graphContainer?.current?.offsetHeight ?? 280}
                      priceLineData={strikeLineData}
                    />
                  </Box>
                  <OutlinedCard padding="16px 20px">
                    <Typography fontSize={16} color={theme.palette.text.primary}>
                      Return on investment:
                    </Typography>
                    <StyledUnorderList>
                      <li>
                        When the final settlement price ≥ {product?.strikePrice ?? '-'} USDT, you will receive{' '}
                        <span style={{ color: theme.palette.text.primary }}>56,750.61 USDT</span>.
                      </li>
                      <li>
                        When the settlement price is &lt; {product?.strikePrice ?? '-'} USDT, you will receive{' '}
                        <span style={{ color: theme.palette.text.primary }}>1.682655 BTC</span>.
                      </li>
                      <li>
                        APY will be refreshed instantly, and Antimatter will use the latest APY when you successfully
                        complete the subscription.
                      </li>
                    </StyledUnorderList>
                  </OutlinedCard>
                </Box>
              </Card>
            </Grid>
            <Grid xs={12} item>
              <Card width="100%" padding="32px 24px">
                <Box display="flex" alignItems="center" gap={11.68}>
                  <RiskStatementIcon />
                  <Typography fontSize={24} fontWeight={700}>
                    Risk statement
                  </Typography>
                </Box>
                <StyledOrderList>
                  <li>
                    This product is a non-principal-guaranteed wealth management product. Market fluctuations may result
                    in a loss of principal. Please invest with caution.
                  </li>
                  <li>
                    The investment amount is calculated in real time with the market, please refer to the actual
                    purchase transaction.
                  </li>
                  <li>
                    The annualized rate of return changes in real time with the market, please refer to the actual rate
                    of return of the purchase transaction.
                  </li>
                  <li>
                    The average spot price of the last 30 minutes at 12:00 (UTC+8) on the delivery date will be used as
                    the settlement price.
                  </li>
                  <li>Early redemption is not supported, and users can only get rewards after the expiry date.</li>
                  <li>
                    After the product is purchased, you can view it on my currency holding page, and the payment will be
                    automatically issued to the Account after the delivery.
                  </li>
                </StyledOrderList>
              </Card>
            </Grid>
            <Grid xs={12} item>
              <Card width="100%" padding="32px 24px">
                <Box display="flex" alignItems="center" gap={11.68}>
                  <Faq />
                  <Typography fontSize={24} fontWeight={700}>
                    FAQ
                  </Typography>
                </Box>
                <Box mt={28}>
                  {[
                    {
                      summary: 'accordion1',
                      details: '123'
                    },
                    {
                      summary: 'accordion2',
                      details: '123'
                    }
                  ].map(({ summary, details }, idx) => (
                    <Accordion
                      key={idx}
                      summary={summary}
                      details={details}
                      expanded={expanded === idx}
                      onChange={() => setExpanded(idx)}
                    />
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
