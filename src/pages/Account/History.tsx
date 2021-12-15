import React, { useMemo, useState } from 'react'
import { Box, Typography, Container } from '@mui/material'
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
import StatusTag from 'components/Status/StatusTag'

enum HistoryMoreHeaderIndex {
  OrderID,
  ProductID,
  Status
}

const HistoryTableHeader = [
  'Invest Amount',
  'APY',
  'Refund Amount',
  'Delivery Date',
  'Holding Days',
  'Strike Price',
  'Settlement Price',
  'Date'
]

const HistoryMoreHeader = ['Order ID', 'Product ID', '']

export default function History() {
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const [page, setPage] = useState(1)
  const { orderList, pageParams } = useOrderRecords(InvestStatus.Settled, page, 8)
  const [hiddenParts, setHiddenParts] = useState<JSX.Element[]>([])

  const data = useMemo(() => {
    if (!orderList) return { hiddenList: [], summaryList: [] }
    const hiddenList: any[][] = []
    const hiddenPartsList: JSX.Element[] = []
    const summaryList = orderList.map(
      ({
        amount,
        annualRor,
        returnedAmount,
        returnedCurrency,
        strikePrice,
        expiredAt,
        ts,
        deliveryPrice,
        currency,
        multiplier,
        investCurrency,
        orderId,
        productId,
        type
      }) => {
        const exercised = type === 'CALL' ? !!(+deliveryPrice >= +strikePrice) : !!(+deliveryPrice <= +strikePrice)
        const hiddenData = [
          orderId,
          productId,
          <StatusTag key={orderId} status={exercised ? 'exercised' : 'unexercised'} />
        ]
        hiddenList.push(hiddenData)
        hiddenPartsList.push(
          <React.Fragment key={orderId}>
            {hiddenData.map((datum, idx) =>
              idx === HistoryMoreHeaderIndex.Status ? (
                datum
              ) : (
                <Box key={idx}>
                  <Typography sx={{ color: theme => theme.palette.text.secondary }} component="span" mr={8}>
                    {HistoryMoreHeader[idx] ? HistoryMoreHeader[idx] : ''}
                  </Typography>
                  <Typography component="span">{datum}</Typography>
                </Box>
              )
            )}
          </React.Fragment>
        )
        return [
          `${amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)} ${investCurrency}`,
          <Typography color="primary" key="1" fontWeight={{ xs: 600, md: 400 }}>
            {(+annualRor * 100).toFixed(2)}%
          </Typography>,
          `${returnedAmount} ${returnedCurrency}`,
          dayjs(+expiredAt * 1000).format('MMM DD, YYYY'),
          `${dayjs().diff(dayjs(ts * 1000), 'day')} days`,
          strikePrice,
          `${deliveryPrice} ${currency}`,
          dayjs(+ts * 1000).format('MMM DD, YYYY hh:mm:ss A')
        ]
      }
    )
    setHiddenParts(hiddenPartsList)
    return { hiddenList, summaryList }
  }, [orderList])

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
              <Table header={HistoryTableHeader} rows={data.summaryList} hiddenParts={hiddenParts} collapsible />
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
              // if (idx2 === HistoryTableHeaderIndex.Date) {
              //   return (
              //     <Box display="flex" alignItems="center" gap={14} key={idx2}>
              //       {datum}
              //       <AccordionButton
              //         onClick={() => {
              //           expanded === idx ? setExpanded(null) : setExpanded(idx)
              //         }}
              //         expanded={expanded === idx}
              //       />
              //     </Box>
              //   )
              // }

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

          {expanded === idx && data.hiddenList[idx] && (
            <>
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
            </>
          )}
        </Card>
      ))}
    </Box>
  )
}
