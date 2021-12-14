import React, { useCallback, useState, useMemo } from 'react'
import { Box, Typography, useTheme, IconButton, Container } from '@mui/material'
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
import { OrderRecord } from 'utils/fetch/product'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'

enum PositionTableHeaderIndex {
  investAmount,
  apy,
  deliveryDate,
  strikePrice,
  estimatedReceive,
  date,
  status
}

const PositionTableHeader = [
  'Invest Amount',
  'APY',
  'Delivery Date',
  'Strike Price',
  'Estimated Receive',
  'Date',
  'Status',
  ''
]

const PositionMoreHeader = ['Order ID', 'Product ID', 'Holding Days', 'Settlement Price']

const PageSize = 8

export default function Position() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const price = usePrice('BTC')
  const { finishOrderCallback } = useDualInvestCallback()
  const { orderList } = useOrderRecords(undefined, undefined, 999999)
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()
  const history = useHistory()

  const handleGoInvest = useCallback(() => {
    history.push(routes.dualInvest)
  }, [history])

  const filteredOrderList = useMemo(() => {
    return orderList?.reduce((acc, order) => {
      if (order.investStatus === InvestStatus.Ordered) {
        acc.push(order)
      }
      if (order.investStatus === InvestStatus.ReadyToSettle) {
        acc.unshift(order)
      }
      return acc
    }, [] as OrderRecord[])
  }, [orderList])

  const pageCount = useMemo(() => {
    if (!filteredOrderList) return 0

    return Math.ceil(filteredOrderList.length / PageSize)
  }, [filteredOrderList])

  const data = useMemo(() => {
    if (!filteredOrderList) return []

    const currentPageList = filteredOrderList.slice((page - 1) * PageSize, page * PageSize)

    return currentPageList.map(
      ({
        amount,
        currency,
        annualRor,
        expiredAt,
        strikePrice,
        earn,
        ts,
        orderId,
        productId,
        deliveryPrice,
        investStatus,
        multiplier,
        investCurrency
      }) => {
        return {
          summary: [
            `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(1)} ${investCurrency}`,
            <Typography color="primary" key="1" variant="inherit">
              {(+annualRor * 100).toFixed(2)}%
            </Typography>,
            dayjs(+expiredAt * 1000).format('MMM DD, YYYY'),
            strikePrice,
            earn,
            dayjs(+ts * 1000).format('MMM DD, YYYY hh:mm:ss A'),
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
                    .then(r => {
                      hideModal()
                      addTransaction(r, {
                        summary: `Claim ${earn} ${currency}`
                      })
                      el.innerHTML = 'Claim'
                      el.disabled = false
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
          ],
          details: [orderId, productId, `${dayjs().diff(dayjs(ts * 1000), 'day')} days`, deliveryPrice]
        }
      }
    )
  }, [filteredOrderList, page, isDownMd, finishOrderCallback, hideModal, addTransaction, showModal])

  const hiddenParts = useCallback(() => {
    return data.map(datum => (
      <>
        {datum.details.map((datum, idx) => (
          <Box key={idx}>
            <Typography color={theme.palette.text.secondary} component="span" mr={8}>
              {PositionMoreHeader[idx]}:
            </Typography>
            <Typography component="span">{datum}</Typography>
          </Box>
        ))}
      </>
    ))
  }, [data, theme.palette.text.secondary])

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

              {data.length === 0 ? (
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
                      header={PositionTableHeader}
                      rows={data.map(datum => datum.summary)}
                      hiddenParts={hiddenParts()}
                      collapsible
                    />
                  )}
                </>
              )}
              <PaginationView
                count={pageCount}
                page={page}
                perPage={PageSize}
                boundaryCount={0}
                total={filteredOrderList?.length}
                onChange={(event, value) => setPage(value)}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  )
}

function PositionTableCards({ data }: { data: { summary: any[]; details: any[] }[] }) {
  const [expanded, setExpanded] = useState<null | number>(null)

  return (
    <Box display="flex" flexDirection="column" gap={8} mt={24} mb={24}>
      {data.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.summary.map((datum, idx2) => {
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

          {expanded === idx && dataRow.details && (
            <>
              <Divider extension={16} color="1px solid #252525" />
              <Box display="flex" flexDirection="column" gap={16} mt={20}>
                {dataRow.details.map((datum, idx) => {
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
            </>
          )}
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

function AccordionButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return <IconButton onClick={onClick}>{expanded ? <AccordionArrowUpIcon /> : <AccordionArrowDownIcon />}</IconButton>
}
