import { useCallback, useState, useMemo } from 'react'
import { Box, Typography, Container } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import ClaimButton from 'components/Button/ClaimButton'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import StatusTag from 'components/Status/StatusTag'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords, InvestStatus, INVEST_TYPE } from 'hooks/useAccountData'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import { usePrice } from 'hooks/usePriceSet'
import { useDualInvestCallback } from 'hooks/useDualInvest'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import ClaimSuccessModal from '../modals/ClaimSuccessModal'
import { parseBalance } from 'utils/parseAmount'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { CURRENCY_ADDRESS_MAP, CURRENCIES } from 'constants/currencies'
/* import { PositionMoreHeader, PositionMoreHeaderIndex, PositionTableHeader } from 'components/Account/PositionTableCards' */
import PositionTableCards from 'components/Account/PositionTableCards'
import { toLocaleNumberString } from 'utils/toLocaleNumberString'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Filter from 'components/Filter'

export const THIRTY_MINUTES_MS = 1800000
export enum PositionMoreHeaderIndex {
  OrderID,
  ProductID,
  SettlementPrice,
  SettlementTime,
  Status
}

export enum PositionTableHeaderIndex {
  investAmount,
  subscribedTime,
  apy,
  deliveryDate,
  strikePrice,
  exercies,
  refundAmount,
  status
}

export const PositionTableHeader = [
  'Token',
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Delivery Date',
  'Strike Price',
  'Exercise',
  'Refund Amount',
  'Status'
]

export const PositionMoreHeader = ['Order ID', 'Product ID', 'Settlement Price', 'Settlement Time', '']

const statusArr = [InvestStatus.Ordered, InvestStatus.ReadyToSettle]

export default function PositionRecur() {
  const [page, setPage] = useState(1)
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const price = usePrice('BTC')
  const { finishOrderCallback } = useDualInvestCallback()
  const { orderList, pageParams } = useOrderRecords(INVEST_TYPE.recur, statusArr, page, 999999)
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()
  const history = useHistory()
  const [checkedFilterOption, setCheckedFilterOption] = useState('All')

  const handleGoInvest = useCallback(() => {
    history.push(routes.recurringVault)
  }, [history])

  const data = useMemo(() => {
    if (!orderList) return { hiddenList: [], summaryList: [], hiddenParts: [] }
    const hiddenList: any[][] = []
    const hiddenPartsList: JSX.Element[] = []
    const summaryList = orderList.map(
      ({
        amount,
        currency,
        annualRor,
        expiredAt,
        strikePrice,
        ts,
        orderId,
        productId,
        deliveryPrice,
        investStatus,
        multiplier,
        investCurrency,
        returnedCurrency,
        returnedAmount,
        type
      }) => {
        const status =
          investStatus === InvestStatus.ReadyToSettle && Date.now() > +expiredAt * 1000 + THIRTY_MINUTES_MS
            ? 'finished'
            : 'progressing'
        const apy = `${(+annualRor * 100).toFixed(2)}%`
        const investAmount = `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
          1
        )} ${investCurrency}`
        const deliveryDate = dayjs(+expiredAt * 1000).format('MMM DD, YYYY') + '\n08:30 AM UTC'
        const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
        const hiddenData = [
          orderId,
          productId,
          deliveryPrice,
          `${dayjs(expiredAt * 1000).format('MMM DD, YYYY')} 08:30 AM UTC`,
          status === 'progressing' ? null : <StatusTag status={exercised ? 'exercised' : 'unexercised'} key={orderId} />
        ]
        hiddenList.push(hiddenData)
        hiddenPartsList.push(
          <Box
            display="grid"
            key={orderId}
            gridTemplateColumns={'1fr 1fr 1fr'}
            width="100%"
            gridTemplateRows={'1fr 1fr'}
          >
            {hiddenData.map((datum, idx) => (
              <Box
                key={idx}
                sx={{
                  gridColumnStart: Math.ceil((idx + 1) / 2),
                  gridColumnEnd: 'span 1',
                  gridRowStart: (idx + 1) % 2,
                  gridRowEnd: 'span 1'
                }}
              >
                {idx === PositionMoreHeaderIndex.Status ? (
                  <Box margin="0 auto" width="max-content">
                    {datum}
                  </Box>
                ) : (
                  <>
                    <Typography sx={{ color: theme => theme.palette.text.secondary }} component="span" mr={8}>
                      {PositionMoreHeader[idx] ?? ''}
                    </Typography>
                    <Typography component="span">{datum}</Typography>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )
        return [
          <Box key="token" display="flex" alignItems="center" gap={13}>
            <CurrencyLogo currency={CURRENCIES[currency]} size="22px" />
            <Typography fontSize={16}>{CURRENCIES[currency].symbol}</Typography>
          </Box>,
          `${investAmount}(${amount})`,
          dayjs(ts * 1000).format('MMM DD, YYYY'),
          <Typography color="primary" key="1" variant="inherit">
            {apy}
          </Typography>,
          deliveryDate,
          strikePrice,
          type === 'CALL' ? 'Upward' : 'Down',
          +returnedAmount > 0 ? +returnedAmount + returnedCurrency : '--',
          <Box display="flex" key="action" gap={isDownMd ? 10 : 8} sx={{ mr: -15 }}>
            <StatusTag status={status} width={isDownMd ? 120 : 100} />
            <ClaimButton
              disabled={status === 'progressing'}
              onClick={e => {
                if (!finishOrderCallback) return
                const el = e.target as HTMLButtonElement
                el.innerHTML =
                  '<span class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-z0i010-MuiCircularProgress-root" role="progressbar" style="width: 16px; height: 16px; position: relative"><svg class="MuiCircularProgress-svg css-1idz92c-MuiCircularProgress-svg" viewBox="22 22 44 44" color="#ffffff"><circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate MuiCircularProgress-circleDisableShrink css-79nvmn-MuiCircularProgress-circle" cx="44" cy="44" r="20.5" fill="none" stroke-width="3"></circle></svg></span>'
                el.disabled = true
                showModal(<TransacitonPendingModal />)
                finishOrderCallback(orderId + '', productId + '')
                  .then(({ r, returnedAmount, returnedCurrency, earned }) => {
                    hideModal()
                    addTransaction(r, {
                      summary: `Claim ${parseBalance(returnedAmount, CURRENCY_ADDRESS_MAP[returnedCurrency], 6)} ${
                        CURRENCY_ADDRESS_MAP[returnedCurrency]?.symbol
                      }`
                    })
                    el.innerHTML = 'Claim'

                    showModal(
                      <ClaimSuccessModal
                        orderId={orderId + ''}
                        exercised={exercised}
                        productId={productId + ''}
                        apy={apy}
                        strikePrice={strikePrice}
                        type={type}
                        currency={currency}
                        deliveryDate={deliveryDate}
                        investAmount={investAmount}
                        earn={earned}
                        returnedCurrency={
                          CURRENCY_ADDRESS_MAP[returnedCurrency]
                            ? CURRENCY_ADDRESS_MAP[returnedCurrency]?.symbol ?? ''
                            : ''
                        }
                      />
                    )
                  })
                  .catch(err => {
                    hideModal()
                    showModal(<MessageBox type="error">Claim failed</MessageBox>)
                    console.error(err)
                    el.innerHTML = 'Claim'
                    el.disabled = false
                  })
              }}
              width={isDownMd ? 84 : 68}
            />
          </Box>
        ]
      }
    )

    return { hiddenList, summaryList, hiddenParts: hiddenPartsList }
  }, [orderList, isDownMd, showModal, finishOrderCallback, hideModal, addTransaction])

  if (!account)
    return (
      <Container disableGutters sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )

  return (
    <>
      <Box sx={{ mt: 48, width: '100%' }}>
        <Card>
          <Box padding="38px 24px">
            <NumericalCard
              title="BTC latest spot price"
              value={price ? toLocaleNumberString(price, 6) : '-'}
              border={true}
            >
              <Typography sx={{ color: theme => theme.palette.text.secondary }}>
                You can visit specific recurring token page to close your recurring strategy
              </Typography>
            </NumericalCard>
            <Box position="relative">
              {!orderList && (
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

              {data.summaryList.length === 0 ? (
                <NoDataCard text={'You don’t have any positions'}>
                  <Button style={{ marginTop: 24 }} onClick={handleGoInvest} height="44px">
                    Go invest and earn money
                  </Button>
                </NoDataCard>
              ) : (
                <>
                  <Box mt={27} pl={10}>
                    <Filter
                      checkedOption={checkedFilterOption}
                      options={['All', 'BTC', 'ETH', 'BNB']}
                      onChange={e => {
                        setCheckedFilterOption(e.target.id)
                      }}
                    />
                  </Box>

                  {isDownMd ? (
                    <PositionTableCards
                      header={PositionTableHeader}
                      statusIdx={PositionTableHeaderIndex.status}
                      moreHeader={PositionMoreHeader}
                      data={data}
                    />
                  ) : (
                    <Table
                      fontSize="14px"
                      header={PositionTableHeader}
                      rows={data.summaryList}
                      hiddenParts={data.hiddenParts}
                      collapsible
                    />
                  )}
                </>
              )}
              <PaginationView
                count={pageParams.count}
                page={page}
                perPage={pageParams?.perPage}
                boundaryCount={0}
                total={pageParams?.total}
                onChange={(event, value) => setPage(value)}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  )
}
