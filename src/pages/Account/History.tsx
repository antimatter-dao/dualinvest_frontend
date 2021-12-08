import { Box, Typography, Container } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'

const data = [
  [
    '1.290809 BTC',
    <Typography color="primary" key="1">
      140.21%
    </Typography>,
    '1.290809 BTC',
    'Sep 21, 2021',
    '7 days',
    '62800.00',
    '1.954241 BTC',
    'Sep 21, 2021  10:42 AM'
  ]
]

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
