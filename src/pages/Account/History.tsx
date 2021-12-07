import { Box, Typography, Container } from '@mui/material'
import Card from 'components/Card/Card'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import PaginationView from 'components/Pagination'
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

export default function History() {
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
          {data.length ? (
            <>
              <Table
                header={[
                  'Invest Amount',
                  'APY',
                  'Refund Amount',
                  'Delivery Date',
                  'Holding Days',
                  'Strike Price',
                  'Settlement Price',
                  'Date'
                ]}
                rows={data}
              />
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
