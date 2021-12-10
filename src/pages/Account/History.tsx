import { Box, Typography, Container } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { useOrderRecords } from 'hooks/useDualInvestData'
import { useMemo } from 'react'
import dayjs from 'dayjs'

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
  const orderList = useOrderRecords()
  console.log('history', orderList)

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
        dayjs(expiredAt).format('MMM DD, YYYY'),
        `${dayjs().diff(dayjs(createdAt), 'day')} days`,
        strikePrice,
        `${deliveryPrice} ${currency}`,
        dayjs(createdAt).format('MMM DD, YYYY hh:mm:ss A')
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
        <Box padding="38px 24px" display="grid" gap={36}>
          {data.length && isDownMd ? (
            <HistoryTableCards data={data} />
          ) : data.length ? (
            <>
              <Table header={HistoryTableHeader} rows={data} />
              <PaginationView count={20} page={5} setPage={() => {}} />
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
