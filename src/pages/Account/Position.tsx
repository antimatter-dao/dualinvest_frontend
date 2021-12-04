import { useCallback, useState } from 'react'
import { Box, Container, Typography, useTheme } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import Pagination from 'components/Pagination'
import StatusTag from 'components/Status/StatusTag'
import { useActiveWeb3React } from 'hooks'

const positionData = [
  [
    '1.290909 BTC',
    <Typography color="primary" key="1" variant="inherit">
      140.21%
    </Typography>,
    'Sep 21,2021',
    '62800.00',
    '1.954241',
    'Sep 21,2021 10:42 AM',
    <Box display="flex" key="action" gap={10} sx={{ mr: -37 }}>
      <StatusTag status="progressing" />
      <Button fontSize={14} style={{ width: 68, borderRadius: 4, height: 36 }}>
        Claim
      </Button>
    </Box>
  ],
  [
    '1.290909 BTC',
    <Typography color="primary" key="1" variant="inherit">
      140.21%
    </Typography>,
    'Sep 21,2021',
    '62800.00',
    '1.954241',
    'Sep 21,2021 10:42 AM',
    <Box display="flex" key="action" gap={10} sx={{ mr: -37 }}>
      <StatusTag status="recruited" />
      <Button fontSize={14} style={{ width: 68, borderRadius: 4, height: 36 }}>
        Claim
      </Button>
    </Box>
  ]
]

const hiddenData = [
  {
    'Order ID': '767858724324',
    'Product ID': 'BTC-UP-62800-20211129',
    'Holding Days': '7 Days',
    'Settlement Price': '62091.35'
  },
  {
    'Order ID': '767858724324',
    'Product ID': 'BTC-UP-62800-20211129',
    'Holding Days': '7 Days',
    'Settlement Price': '62091.35'
  }
]

export default function Position() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const { account } = useActiveWeb3React()

  const hiddenParts = useCallback(() => {
    return hiddenData.map(data => (
      <>
        {Object.keys(data).map((key, idx) => (
          <Box key={idx}>
            <Typography color={theme.palette.text.secondary} component="span" mr={8}>
              {key}:
            </Typography>
            <Typography component="span">{data[key as keyof typeof data]}</Typography>
          </Box>
        ))}
      </>
    ))
  }, [theme.palette.text.secondary])

  if (!account)
    return (
      <Container sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )

  return (
    <>
      <Box sx={{ mt: 48, width: '100%' }}>
        <Card>
          <Box padding="38px 24px">
            <NumericalCard title="BTC latest spot price" value="57640.00" border={true} />

            {positionData ? (
              <Table
                header={[
                  'Invest Amount',
                  'APY',
                  'Delivery Date',
                  'Strike Price',
                  'Estimated Receive',
                  'Date',
                  'Status',
                  ''
                ]}
                rows={positionData}
                hiddenParts={hiddenParts()}
                collapsible
              />
            ) : (
              <NoDataCard height="20vh" />
            )}

            <Pagination count={10} page={page} setPage={setPage} perPage={12} boundaryCount={-1} />
          </Box>
        </Card>
      </Box>
    </>
  )
}
