import React, { useCallback, useState, useMemo } from 'react'
import { Box, Typography, IconButton, Container, Collapse } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactComponent as AccordionArrowDownIcon } from 'assets/componentsIcon/accordion_arrow_down.svg'
import { ReactComponent as AccordionArrowUpIcon } from 'assets/componentsIcon/accordion_arrow_up.svg'
import Divider from 'components/Divider'
import StatusTag from 'components/Status/StatusTag'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords, InvestStatus } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import { usePrice } from 'hooks/usePriceSet'
import { useDualInvestCallback } from 'hooks/useDualInvest'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import ClaimSuccessModal from './modals/ClaimSuccessModal'
import { parseBalance } from 'utils/parseAmount'
import { BTC, USDT } from 'constants/index'

enum PositionMoreHeaderIndex {
  OrderID,
  ProductID,
  SettlementPrice,
  SettlementTime,
  Status
}

enum PositionTableHeaderIndex {
  investAmount,
  subscribedTime,
  apy,
  deliveryDate,
  strikePrice,
  exercies,
  refundAmount,
  status
}

const PositionTableHeader = [
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Delivery Date',
  'Strike Price',
  'Exercise',
  'Refund Amount',
  'Status',
  ''
]

const PositionMoreHeader = ['Order ID', 'Product ID', 'Settlement Price', 'Settlement Time', '']
const statusArr = [InvestStatus.Ordered, InvestStatus.ReadyToSettle]

export default function Position() {
  const [page, setPage] = useState(1)
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const price = usePrice('BTC')
  const { finishOrderCallback } = useDualInvestCallback()
  const { orderList, pageParams } = useOrderRecords(statusArr, page, 999999)
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()
  const history = useHistory()

  const handleGoInvest = useCallback(() => {
    history.push(routes.dualInvest)
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
        const apy = `${(+annualRor * 100).toFixed(2)}%`
        const investAmount = `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
          1
        )} ${investCurrency}`
        const deliveryDate = dayjs(+expiredAt * 1000).format('MMM DD, YYYY')
        const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
        const hiddenData = [
          orderId,
          productId,
          deliveryPrice,
          `${dayjs(expiredAt * 1000).format('MMM DD, YYYY hh:mm A')}`,
          <StatusTag status={exercised ? 'exercised' : 'unexercised'} key={orderId} />
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
          investAmount,
          dayjs(ts * 1000).format('MMM DD, YYYY hh:mm A'),
          <Typography color="primary" key="1" variant="inherit">
            {apy}
          </Typography>,
          deliveryDate,
          strikePrice,
          type === 'CALL' ? 'Upward' : 'Down',
          +returnedAmount > 0 ? +returnedAmount + returnedCurrency : '--',
          <Box display="flex" key="action" gap={isDownMd ? 10 : 8} sx={{ mr: -15 }}>
            <StatusTag
              status={investStatus === InvestStatus.Ordered ? 'progressing' : 'finished'}
              width={isDownMd ? 120 : 100}
            />
            <ClaimButton
              disabled={!(investStatus === InvestStatus.ReadyToSettle)}
              onClick={e => {
                if (!finishOrderCallback) return
                const el = e.target as HTMLButtonElement
                el.innerHTML =
                  '<span class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-z0i010-MuiCircularProgress-root" role="progressbar" style="width: 16px; height: 16px; position: relative"><svg class="MuiCircularProgress-svg css-1idz92c-MuiCircularProgress-svg" viewBox="22 22 44 44" color="#ffffff"><circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate MuiCircularProgress-circleDisableShrink css-79nvmn-MuiCircularProgress-circle" cx="44" cy="44" r="20.5" fill="none" stroke-width="3"></circle></svg></span>'
                el.disabled = true
                showModal(<TransacitonPendingModal />)
                finishOrderCallback(orderId + '', productId + '')
                  .then(({ r, returnedAmount, returnedCurrency }) => {
                    const earned =
                      +parseBalance(returnedAmount, returnedCurrency == BTC.address ? BTC : USDT) -
                      +(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(4) +
                      ''
                    hideModal()
                    addTransaction(r, {
                      summary: `Claim ${returnedAmount} ${returnedCurrency}`
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
                        returnedCurrency={returnedCurrency == BTC.address ? BTC.symbol ?? '' : USDT.symbol ?? ''}
                      />
                    )
                  })
                  .catch(err => {
                    hideModal()
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
              value={price ? (+price).toLocaleString() : '-'}
              border={true}
            />
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
                  {isDownMd ? (
                    <PositionTableCards data={data} />
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

function PositionTableCards({ data }: { data: { summaryList: any[][]; hiddenList: any[][] } }) {
  const [expanded, setExpanded] = useState<null | number>(null)

  return (
    <Box display="flex" flexDirection="column" gap={8} mt={24} mb={24}>
      {data.summaryList.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx2) => {
              if (idx2 === PositionTableHeaderIndex.status) {
                return (
                  <Box display="flex" alignItems="center" gap={14} key={idx2}>
                    {datum}
                    <AccordionButton
                      onClick={() => {
                        expanded === idx ? setExpanded(null) : setExpanded(idx)
                      }}
                      expanded={expanded === idx}
                    />
                  </Box>
                )
              }

              return (
                <Box key={idx2} display="flex" justifyContent="space-between">
                  <Typography component="div" fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {PositionTableHeader[idx2]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600} component="div">
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Collapse in={expanded === idx && !!data.hiddenList[idx]}>
            <Divider extension={16} color="1px solid #252525" />
            <Box display="flex" flexDirection="column" gap={16} mt={20}>
              {data.hiddenList[idx].map((datum, idx) => {
                return (
                  <Box key={idx} display="flex" justifyContent="space-between">
                    <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                      {PositionMoreHeader[idx]}
                    </Typography>
                    <Typography fontSize={12} fontWeight={600}>
                      {datum}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Collapse>
        </Card>
      ))}
    </Box>
  )
}

function ClaimButton({
  width,
  onClick,
  disabled
}: {
  width?: number
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      fontSize={14}
      style={{ width: width || 60, borderRadius: 4, height: 36 }}
    >
      Claim
    </Button>
  )
}

export function AccordionButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: 'max-content',
        height: 'max-content'
      }}
    >
      {expanded ? <AccordionArrowUpIcon /> : <AccordionArrowDownIcon />}
    </IconButton>
  )
}
