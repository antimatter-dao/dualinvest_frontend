import { useMemo, useState } from 'react'
import { Box, Typography, Container } from '@mui/material'
import dayjsPluginUTC from 'dayjs-plugin-utc'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords, InvestStatus, INVEST_TYPE, FilterType } from 'hooks/useAccountData'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import HistoryTableCards from 'components/Account/HistoryTableCards'
// import Button from 'components/Button/Button'
import StatusTag from 'components/Status/StatusTag'
import Filter from 'components/Filter'
// import { useShowClaimSuccessModal } from 'hooks/useSuccessImage'

dayjs.extend(dayjsPluginUTC)

enum HistoryMoreHeaderIndex {
  OrderID,
  ProductID,
  SettlementPrice,
  SettlementTime,
  Status,
  Share
}

const HistoryTableHeader = [
  'Invest Amount\n(Subscription Amount)',
  'APY',
  'Subscribed Time',
  'Strike Price',
  'Exercise',
  'Holding Days',
  'Execute Amount',
  'Delivery Date',
  'Status'
]

const HistoryMoreHeader = ['Order ID', 'Product ID', 'Settlement Price', 'Settlement Time', '', '']
const statusList = [InvestStatus.Settled, InvestStatus.OrderFailed, InvestStatus.EverythingFailed]
export default function HistoryDualInvest() {
  const [page, setPage] = useState(1)
  const [hiddenParts, setHiddenParts] = useState<JSX.Element[]>([])
  const [checkedFilterOption, setCheckedFilterOption] = useState<FilterType>('All')
  const { orderList, pageParams } = useOrderRecords(
    INVEST_TYPE.dualInvest,
    checkedFilterOption,
    statusList,
    page,
    999999
  )
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  // const { showClaimSuccessModalCallback } = useShowClaimSuccessModal()

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
        investStatus,
        type
      } = order
      const exercised = type === 'CALL' ? !!(+deliveryPrice > +strikePrice) : !!(+deliveryPrice < +strikePrice)
      const failed = investStatus !== InvestStatus.Settled
      const hiddenData = [
        orderId,
        productId,
        deliveryPrice,
        `${dayjs(expiredAt * 1000).format('MMM DD, YYYY')} 08:30 AM UTC`
        // failed ? null : <StatusTag status={exercised ? 'exercised' : 'unexercised'} key={orderId} />
        // <Box key="orderId" margin="0 auto" width="max-content" display="inline-block" mt="5px">
        //   <Button
        //     height={'36px'}
        //     width="100px"
        //     onClick={showClaimSuccessModalCallback(order)}
        //     style={{ margin: '0 auto' }}
        //   >
        //     Share
        //   </Button>
        // </Box>
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
        `${(amount * +multiplier * (investCurrency === 'USDT' ? +strikePrice : 1)).toFixed(
          2
        )} ${investCurrency} (${amount})`,
        <Typography color="primary" key="1" fontWeight={{ xs: 600, md: 400 }}>
          {(+annualRor * 100).toFixed(2)}%
        </Typography>,
        (dayjs(ts * 1000) as any).utc().format('MMM DD, YYYY \nhh:mm A') + ' UTC',
        strikePrice,
        type === 'CALL' ? 'Upward' : 'Down',
        failed ? '' : `${dayjs().diff(dayjs(ts * 1000), 'day')} days`,
        failed ? '' : `${returnedAmount} ${returnedCurrency}`,
        failed ? '' : dayjs(+expiredAt * 1000).format('MMM DD, YYYY') + '\n08:30 AM UTC',
        <StatusTag key={orderId} status={failed ? 'failed' : exercised ? 'exercised' : 'unexercised'} />
      ]
    })
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
          <Filter
            checkedOption={checkedFilterOption}
            onChange={option => {
              setCheckedFilterOption(option)
            }}
          />
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
            <>
              <HistoryTableCards data={data} header={HistoryTableHeader} moreHeader={HistoryMoreHeader} />{' '}
              <PaginationView
                count={pageParams?.count}
                page={page}
                perPage={pageParams?.perPage}
                boundaryCount={0}
                total={pageParams.total}
                onChange={(event, value) => setPage(value)}
              />
            </>
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
            <NoDataCard height="40vh" />
          )}
        </Box>
      </Card>
    </Box>
  )
}
