import { Container, Box, Typography } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { useCallback } from 'react'

const positionData = [
  [
    '1.290909 BTC',
    '140.21%',
    'Sep 21,2021',
    '62800.00',
    '1.954241',
    'Sep 21,2021 10:42 AM',
    'Progressing',
    <Box display="flex" key="action" gap={10}>
      <Button fontSize={14} style={{ maxWidth: 68, borderRadius: 4, height: 36 }}>
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
  }
]

export default function Position() {
  const hiddenParts = useCallback(() => {
    return hiddenData.map((data, idx) => (
      <Box key={idx} display="flex">
        {Object.keys(data).map((key, idx) => (
          <Typography key={idx}>
            {key}: {data[key as keyof typeof data]}
          </Typography>
        ))}
      </Box>
    ))
  }, [])

  return (
    <Container sx={{ mt: 48 }}>
      <Card>
        <Box padding="38px 24px">
          {positionData ? (
            <Table
              header={['Invest Amount', 'APY', 'Delivery Date', 'Strike Price', 'Estimated Receive', 'Date', 'Status']}
              rows={positionData}
              hiddenParts={hiddenParts()}
              collapsible
            />
          ) : (
            <NoDataCard />
          )}
        </Box>
      </Card>
    </Container>
  )
}
