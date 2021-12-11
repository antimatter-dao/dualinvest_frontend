import { Box, Typography, Container } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords, InvestStatus } from 'hooks/useDualInvestData'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'

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

export default function History() {
  const isDownMd = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const [page, setPage] = useState(1)
  const { orderList, pageParams } = useOrderRecords(InvestStatus.Settled, page, 8)

  const data = useMemo(() => {
    if (!orderList) return []
    return orderList.map(
      ({
        amount,
        annualRor,
        returnedAmount,
        returnedCurrency,
        strikePrice,
        expiredAt,
        createdAt,
        deliveryPrice,
        currency
      }) => [
        amount,
        <Typography color="primary" key="1" fontWeight={{ xs: 600, md: 400 }}>
          {(+annualRor * 100).toFixed(2)}%
        </Typography>,
        `${returnedAmount} ${returnedCurrency}`,
        dayjs(+expiredAt * 1000).format('MMM DD, YYYY'),
        `${dayjs().diff(dayjs(createdAt * 1000), 'day')} days`,
        strikePrice,
        `${deliveryPrice} ${currency}`,
        dayjs(+createdAt * 1000).format('MMM DD, YYYY hh:mm:ss A')
      ]
    )
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
          {data.length && isDownMd ? (
            <HistoryTableCards data={data} />
          ) : data.length ? (
            <>
              <Table header={HistoryTableHeader} rows={data} />
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

function HistoryTableCards({ data }: { data: any[][] }) {
  return (
    <>
      {data.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx) => {
              return (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {HistoryTableHeader[idx]}
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
