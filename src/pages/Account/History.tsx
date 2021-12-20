import { useMemo, useState } from 'react'
import { Box, Typography, Container, Collapse } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords, InvestStatus } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import { AccordionButton } from './Position'
import Divider from 'components/Divider'
import Button from 'components/Button/Button'
import StatusTag from 'components/Status/StatusTag'
import { useShowClaimSuccessModal } from 'hooks/useSuccessImage'

enum HistoryMoreHeaderIndex {
  OrderID,
  ProductID,
  SettlementPrice,
  SettlementTime,
  Status,
  Share
}

const HistoryTableHeader = [
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Delivery Date',
  'Strike Price',
  'Exercise',
  'Holding Days',
  'Refund Amount'
]

const HistoryMoreHeader = ['Order ID', 'Product ID', 'Settlement Price', 'Settlement Time', '', '']

export default function History() {
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const [page, setPage] = useState(1)
  const { orderList, pageParams } = useOrderRecords(InvestStatus.Settled, page, 8)
  const [hiddenParts, setHiddenParts] = useState<JSX.Element[]>([])
  const { showClaimSuccessModalCallback } = useShowClaimSuccessModal()

  const data = useMemo(() => {
    if (!orderList) return { hiddenList: [], summaryList: [] }
    const hiddenList: any[][] = []
    const hiddenPartsList: JSX.Element[] = []
    const summaryList = orderList.map(order => {
      const {
        amount,
        annualRor,
        returnedAmount,
        returnedCurrency,
        strikePrice,
        expiredAt,
        ts,
        deliveryPrice,
        multiplier,
        investCurrency,
        orderId,
        productId,
        type
      } = order
      const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
      const hiddenData = [
        orderId,
        productId,
        deliveryPrice,
        `${dayjs(expiredAt * 1000).format('MMM DD, YYYY hh:mm A')}`,
        <StatusTag status={exercised ? 'exercised' : 'unexercised'} key={orderId} />,
        <Box key="orderId" margin="0 auto" width="max-content" display="inline-block" mt="5px">
          <Button
            height={'36px'}
            width="100px"
            onClick={showClaimSuccessModalCallback(order)}
            style={{ margin: '0 auto' }}
          >
            Share
          </Button>
        </Box>
      ]
      hiddenList.push(hiddenData)
      hiddenPartsList.push(
        <Box display="grid" key={orderId} gridTemplateColumns={'1fr 1fr 1fr'} width="100%" gridTemplateRows={'1fr 1fr'}>
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
              {idx === HistoryMoreHeaderIndex.Status || idx === HistoryMoreHeaderIndex.Share ? (
                <Box margin="0 auto" width="max-content">
                  {datum}
                </Box>
              ) : (
                <>
                  <Typography sx={{ color: theme => theme.palette.text.secondary }} component="span" mr={8}>
                    {HistoryMoreHeader[idx] ?? ''}
                  </Typography>
                  <Typography component="span">{datum}</Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      )
      return [
        `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(1)} ${investCurrency}`,
        dayjs(ts * 1000).format('MMM DD, YYYY hh:mm A'),
        <Typography color="primary" key="1" fontWeight={{ xs: 600, md: 400 }}>
          {(+annualRor * 100).toFixed(2)}%
        </Typography>,

        dayjs(+expiredAt * 1000).format('MMM DD, YYYY'),
        strikePrice,
        type === 'CALL' ? 'Upward' : 'Down',
        `${dayjs().diff(dayjs(ts * 1000), 'day')} days`,
        `${returnedAmount} ${returnedCurrency}`
      ]
    })
    setHiddenParts(hiddenPartsList)
    return { hiddenList, summaryList }
  }, [orderList, showClaimSuccessModalCallback])

  if (!account)
    return (
      <Container disableGutters sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )

  return (
    <Box sx={{ mt: 48, width: '100%' }}>
      <Card>
        <Box padding="38px 24px" display="grid" gap={36} position="relative">
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
          {data.summaryList.length && isDownMd ? (
            <HistoryTableCards data={data} />
          ) : data.summaryList.length ? (
            <>
              <Table
                header={HistoryTableHeader}
                rows={data.summaryList}
                hiddenParts={hiddenParts}
                collapsible
                fontSize="14px"
              />
              <PaginationView
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
      </Card>
    </Box>
  )
}

function HistoryTableCards({ data }: { data: { summaryList: any[][]; hiddenList: any[][] } }) {
  const [expanded, setExpanded] = useState<null | number>(null)

  return (
    <Box display="flex" flexDirection="column" gap={8} mt={24} mb={24}>
      {data.summaryList.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx2) => {
              return (
                <Box key={idx2} display="flex" justifyContent="space-between">
                  <Typography component="div" fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {HistoryTableHeader[idx2]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600} component="div">
                    {datum}
                  </Typography>
                </Box>
              )
            })}
            <Box marginLeft="auto">
              <AccordionButton
                onClick={() => {
                  expanded === idx ? setExpanded(null) : setExpanded(idx)
                }}
                expanded={expanded === idx}
              />
            </Box>
          </Box>

          <Collapse in={expanded === idx && !!data.hiddenList[idx]}>
            <Divider extension={16} color="1px solid #252525" />
            <Box display="flex" flexDirection="column" gap={16} mt={20}>
              {data.hiddenList[idx].map((datum, idx) => {
                return (
                  <Box key={idx} display="flex" justifyContent="space-between">
                    <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                      {HistoryMoreHeader[idx]}
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
