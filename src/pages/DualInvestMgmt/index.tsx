import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Box, Typography, Grid, styled } from '@mui/material'
import dayjs from 'dayjs'
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
import { BTC, USDT } from 'constants/index'
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
import { usePriceSet } from 'hooks/usePriceSet'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'

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

const AccordionDetailText = styled(Box)({
  opacity: 0.5,
  display: 'grid',
  gap: 8,
  '& p': {
    margin: 0
  }
})

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
  const [currentCurrency, setCurrentCurrency] = useState(BTC)

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
  const priceSet = usePriceSet(product?.currency)
  const multiplier = product ? (product.type === 'CALL' ? 1 : +product.strikePrice) : 1

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
      ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') : '-',
      // ['Current Progress']: 0.16,
      minAmount: product ? +product.multiplier * multiplier + ' ' + product.investCurrency : '-',
      maxAmount: product ? +product.orderLimit * +product.multiplier * multiplier + ' ' + product.investCurrency : '-'
    }),
    [multiplier, product]
  )

  const handleSubscribe = useCallback(async () => {
    if (!product || !amount || !createOrderCallback) return
    const val = tryParseAmount((+amount * +product?.multiplier).toString(), currentCurrency)?.raw?.toString()
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
      await createOrderCallback(orderId, productId, val, currentCurrency.address)
      let fail = 0
      const polling = new Promise((resolve, reject) => {
        const timeoutId = setInterval(() => {
          Axios.get<{ records: OrderRecord[] }>('getOrderRecord?orderId=' + orderId, { address: account })
            .then(r => {
              const statusCode = r.data.data.records[0].investStatus as keyof typeof InvesStatus
              if (InvesStatus[statusCode] === InvesStatusType.ERROR) {
                clearInterval(timeoutId)
                reject('Order fail')
                throw Error('Order fail')
              }
              if (InvesStatus[statusCode] === InvesStatusType.SUCCESS) {
                clearInterval(timeoutId)
                resolve(() => {})
                setAmount('')
                showModal(
                  <TransactionSubmittedModal header={'Successful Subscription!'}>
                    <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
                      {`You have successfully subscribed ${+product?.multiplier * +amount * multiplier} ${
                        product?.currency
                      } to ${product.investCurrency}[${product?.type === 'CALL' ? 'upward' : 'drop'} exercise] ${
                        product.strikePrice
                      } ${dayjs(product.expiredAt).format()}`}
                    </Typography>
                  </TransactionSubmittedModal>
                )
              }
            })
            .catch(() => {
              if (fail > 6) {
                clearInterval(timeoutId)
                reject('Confirm Order timeout')
                throw Error('Confirm Order timeout')
              }
              fail++
            })
        }, 3000)
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
      setAmount('')
      showModal(<MessageBox type="error">{(e as any)?.error?.message || (e as Error).message || e}</MessageBox>)
      console.error(e)
    }
  }, [account, addPopup, amount, createOrderCallback, currentCurrency, id, multiplier, product, showModal])

  const error = useMemo(() => {
    if (!product || !balance) return ''
    let str = ''
    if (amount !== '' && +balance < +amount * +product.multiplier * multiplier) str = ErrorType.insufficientBalance
    if (amount !== '' && (+amount > +product?.orderLimit || +amount < 1)) str = ErrorType.singleLimitExceed
    return str
  }, [amount, balance, multiplier, product])

  const strikeLineData = useMemo(() => {
    return product?.expiredAt && product?.strikePrice
      ? { time: product.expiredAt as Time, value: +product.strikePrice }
      : undefined
  }, [product?.expiredAt, product?.strikePrice])

  useEffect(() => {
    product?.type === 'CALL' ? setCurrentCurrency(BTC) : setCurrentCurrency(USDT)
  }, [product?.type])

  return (
    <>
      <ActionModal isOpen={isDepositOpen} onDismiss={hideDeposit} token={currentCurrency} type={ActionType.DEPOSIT} />
      <Box display="grid" width="100%" alignContent="flex-start" marginBottom="auto" justifyItems="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: theme.palette.background.paper,
            height: 72
          }}
        >
          <Box maxWidth={theme.width.maxContent} width="100%">
            <NavLink to={routes.dualInvest} style={{ textDecoration: 'none' }}>
              <ArrowLeft />
              <Typography component="span" color={theme.bgColor.bg1} fontSize={14} ml={16}>
                Back
              </Typography>
            </NavLink>
          </Box>
        </Box>
        <Box padding="60px 0" sx={{ maxWidth: theme.width.maxContent }} width="100%">
          <Box mb={60}>
            <Typography fontSize={44} fontWeight={700} component="span">
              {product?.investCurrency} Financial Management
            </Typography>
            <Typography fontSize={44} fontWeight={400} component="span" ml={8}>
              [{product?.type === 'CALL' ? 'upward' : 'drop'} exercise]
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
                  <Spinner size={100} />
                </Box>
              )}
              <Card width="100%" padding="36px 24px" style={{ height: '100%' }}>
                <Box display="flex" flexDirection="column" gap={20} height="100%">
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
                        setAmount(
                          balance ? `${Math.floor(+balance / ((product ? +product?.multiplier : 1) * multiplier))}` : ''
                        )
                      }}
                      label={'Subscription Amount'}
                      onChange={e => setAmount(e.target.value)}
                      balance={balance || '-'}
                      unit={product?.investCurrency ?? ''}
                      endAdornment={
                        <Typography noWrap fontSize={12} alignItems="center">
                          {product && product?.multiplier && product?.investCurrency ? (
                            <>
                              <span style={{ margin: '0 2px' }}>X</span>
                              {product.multiplier}
                              {product.type === 'PUT' && (
                                <Typography component="span" sx={{ marginLeft: '10px' }} fontSize={12}>
                                  <span style={{ margin: '0 2px' }}>X</span>
                                  {product.strikePrice}
                                </Typography>
                              )}
                              {product.type === 'PUT' && <br />}
                              <Typography
                                component="span"
                                sx={{ margin: '0 10px', marginLeft: product.type === 'PUT' ? 'auto' : undefined }}
                                fontSize={12}
                              >
                                =
                              </Typography>
                              <Typography component="span" color="primary" fontSize={14}>
                                {+product.multiplier * +amount * multiplier} {product.investCurrency}
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
                    <Box display="flex" alignItems="center" gap={24}>
                      <Box display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#18A0FB" />
                        <Typography fontSize={12} color="#18A0FB">
                          Spot Price
                        </Typography>
                      </Box>
                      <Box fontSize={12} display="flex" alignItems="center" gap={8}>
                        <Box height={10} width={10} borderRadius="50%" bgcolor="#F0B90B" />
                        <Typography fontSize={12} color="#F0B90B">
                          Strike Price
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ maxWidth: '100vw', height: '100%', flexGrow: 1 }}>
                    <Box
                      maxHeight="100%"
                      height="100%"
                      gap={20}
                      display={{ xs: 'grid', md: 'flex', maxWidth: '100vw' }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{
                          height: { xs: '300px', md: '100%', maxWidth: '100vw', width: { xs: '100%', md: 'auto' } }
                        }}
                        ref={graphContainer}
                      >
                        {product && priceSet ? (
                          <LineChart
                            lineColor="#18A0FB"
                            lineSeriesData={priceSet}
                            unit="usdt"
                            id="incomeGraph"
                            height={graphContainer?.current?.offsetHeight ?? 280}
                            strikeData={strikeLineData}
                          />
                        ) : (
                          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                            <Spinner size={100} marginRight="auto" marginLeft="auto" />
                          </Box>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ height: { xs: 'auto', md: '100%' } }}
                        paddingBottom={{ xs: 0, md: 22 }}
                      >
                        <Box display={{ xs: 'flex', md: 'grid' }} gap={20}>
                          <Card gray>
                            <Box padding="16px" fontSize={14}>
                              Settlement price ≥ {product?.strikePrice ?? '-'}USDT, will be exercised Estimated return{' '}
                              {product?.gtStrikePrice}
                              {product?.strikeCurrency}
                            </Box>
                          </Card>
                          <Card gray>
                            <Box padding="16px" fontSize={14}>
                              Settlement price &lt; {product?.strikePrice ?? '-'}USDT, will not be exercised Estimated
                              return {product?.ltStrikePrice}
                              {product?.investCurrency}
                            </Box>
                          </Card>
                        </Box>
                      </Grid>
                    </Box>
                  </Box>
                  <OutlinedCard padding="16px 20px">
                    <Typography fontSize={16} color={theme.palette.text.primary}>
                      Return on investment:
                    </Typography>
                    <StyledUnorderList>
                      <li>
                        When the final settlement price ≥ {product?.strikePrice ?? '-'} USDT, you will receive{' '}
                        <span style={{ color: theme.palette.text.primary }}>
                          {product?.gtStrikePrice}
                          {product?.strikeCurrency}
                        </span>
                        .
                      </li>
                      <li>
                        When the settlement price is &lt; {product?.strikePrice ?? '-'} USDT, you will receive{' '}
                        <span style={{ color: theme.palette.text.primary }}>
                          {product?.ltStrikePrice}
                          {product?.investCurrency}
                        </span>
                        .
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
                      summary: 'What is Dual Investment?',
                      details: (
                        <AccordionDetailText>
                          Antimatter Dual Investment is an advanced options derivative based on a decentralised
                          protocol. The product has a &quot;market-neutral, returns guaranteed&quot; feature, where the
                          yield is clear and fixed at the time of purchase, while the settlement currency is uncertain.
                          At maturity, the settlement currency depends on the outcome of the settlement price at
                          maturity compared to the strike price.
                        </AccordionDetailText>
                      )
                    },
                    {
                      summary: 'How is my return calculated?',
                      details: (
                        <AccordionDetailText>
                          <p>
                            When a product is &quot;exercised&quot;, the subscription amount and yields will be swapped
                            at the strike price in the alternative currency.
                          </p>
                          <p>
                            <b>Up-and-Exercised:</b> Yields = (Subscription Amount * Strike Price) * [1 + (APY % *
                            Period (days) / 365)]
                          </p>
                          <p>
                            <b>Down-and-Exercised:</b> Yields = (Subscription Amount / Strike Price) * [1 + (APY % *
                            Cycle (Days) / 365)]
                          </p>
                          <p>
                            When a subscription is &quot;unexercised&quot;, the subscription amount and yields will not
                            be transferred into the alternative currency and the user will receive the currency they
                            invested.
                          </p>
                          <p>
                            <b>Yields</b> = Subscription Amount * [1 + (APY% * Period (days) / 365)]
                          </p>
                          <p>
                            Yields will be automatically credited to the user&apos;s account within 24 hours of
                            settlement.
                          </p>
                        </AccordionDetailText>
                      )
                    },
                    {
                      summary:
                        'What are “Strike Price”, “Underlying Asset”, “Deposit Currency”, “Alternate Currency”, “Deposit Days”, and “Settlement Price”?',
                      details: (
                        <AccordionDetailText>
                          <p>
                            <b>Strike Price</b> - A set price at which deposit currency will be converted into alternate
                            currency if the product is exercised.
                          </p>
                          <p>
                            <b>Underlying Asset</b> - An asset on which a Dual Investment product is based. For
                            instance, if you are making reference to BTC spot price and BTC strike price, then the
                            underlying asset is BTC.
                          </p>
                          <p>
                            <b>Deposit Currency</b> - The currency you have used to subscribe to a Dual Investment
                            product.
                          </p>
                          <p>
                            <b>Alternate Currency</b> - The currency you will be receiving if the product is exercised.
                          </p>
                          <p>
                            <b>Deposit Days</b> - A number of days remaining until the delivery date.
                          </p>
                          <p>
                            <b>Settlement Price</b> - Average of the spot price in the last 30 minutes before 08:00
                            (UTC) on the delivery date. Settlement price and strike price determines whether a product
                            is exercised or not.
                          </p>
                        </AccordionDetailText>
                      )
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
