import { useCallback, useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import Pagination from 'components/Pagination'

const positionData = [
  [
    '1.290909 BTC',
    '140.21%',
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
    '140.21%',
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

function StatusTag({ status }: { status: 'progressing' | 'recruited' }) {
  return (
    <Box
      component="div"
      borderRadius={22}
      color={status === 'progressing' ? '#18A0FB' : '#31B047'}
      bgcolor={status === 'progressing' ? 'rgba(24, 160, 251, 0.16)' : 'rgba(49, 176, 71, 0.16)'}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={100}
      height={36}
    >
      {status === 'progressing' ? 'Progressing' : 'Recruited'}
    </Box>
  )
}

export default function Position() {
  const theme = useTheme()
  const [page, setPage] = useState(1)

  const hiddenParts = useCallback(() => {
    return hiddenData.map((data, idx) => (
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
  }, [])

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
              <NoDataCard />
            )}

            <Pagination count={10} page={page} setPage={setPage} perPage={12} boundaryCount={-1} />
          </Box>
        </Card>
      </Box>
    </>
  )
}
