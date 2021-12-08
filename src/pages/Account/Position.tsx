import { useCallback, useState } from 'react'
import { Box, Typography, useTheme, IconButton } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import Pagination from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactComponent as AccordionArrowDownIcon } from 'assets/componentsIcon/accordion_arrow_down.svg'
import { ReactComponent as AccordionArrowUpIcon } from 'assets/componentsIcon/accordion_arrow_up.svg'
import Divider from 'components/Divider'

enum PositionTableHeaderIndex {
  investAmount,
  apy,
  deliveryDate,
  strikePrice,
  estimatedReceive,
  date,
  status
}

const PositionTableHeader = [
  'Invest Amount',
  'APY',
  'Delivery Date',
  'Strike Price',
  'Estimated Receive',
  'Date',
  'Status',
  ''
]

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
      <ClaimButton onClick={() => {}} />
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
      <ClaimButton onClick={() => {}} />
    </Box>
  ]
]

const PositionMoreHeader = ['Order ID', 'Product ID', 'Holding Days', 'Settlement Price']
const positionMoreData = [
  ['767858724324', 'BTC-UP-62800-20211129', '7 Days', '62091.35'],
  ['767858724324', 'BTC-UP-62800-20211129', '7 Days', '62091.35']
]

function StatusTag({ status, width }: { status: 'progressing' | 'recruited'; width?: number }) {
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
      width={width || 100}
      height={36}
    >
      {status === 'progressing' ? 'Progressing' : 'Recruited'}
    </Box>
  )
}

export default function Position() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const isDownMd = useBreakpoint('md')

  const hiddenParts = useCallback(() => {
    return positionMoreData.map(data => (
      <>
        {data.map((datum, idx) => (
          <Box key={idx}>
            <Typography color={theme.palette.text.secondary} component="span" mr={8}>
              {PositionMoreHeader[idx]}:
            </Typography>
            <Typography component="span">{datum}</Typography>
          </Box>
        ))}
      </>
    ))
  }, [theme.palette.text.secondary])

  return (
    <>
      <Box sx={{ mt: 48, width: '100%' }}>
        <Card>
          <Box padding="38px 24px">
            <NumericalCard title="BTC latest spot price" value="57640.00" border={true} />

            {positionData && isDownMd ? (
              <PositionTableCards data={positionData} hiddenData={positionMoreData} />
            ) : positionData ? (
              <Table header={PositionTableHeader} rows={positionData} hiddenParts={hiddenParts()} collapsible />
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

function PositionTableCards({ data, hiddenData }: { data: any[][]; hiddenData: any[][] }) {
  const [expanded, setExpanded] = useState<null | number>(null)

  return (
    <>
      {data.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx) => {
              if (idx === PositionTableHeaderIndex.status) return null
              return (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {PositionTableHeader[idx]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600}>
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>
          <Box display="flex" gap={8} mt={20} alignItems="center" mb={18}>
            <StatusTag status="progressing" width={120} />
            <ClaimButton width={84} onClick={() => {}} />
            <AccordionButton
              onClick={() => {
                expanded === idx ? setExpanded(null) : setExpanded(idx)
              }}
              expanded={expanded === idx}
            />
          </Box>
          {expanded === idx && hiddenData && hiddenData[idx] && (
            <>
              <Divider extension={16} color="1px solid #252525" />
              <Box display="flex" flexDirection="column" gap={16} mt={20}>
                {hiddenData &&
                  hiddenData[idx]?.map((datum, idx) => {
                    return (
                      <Box key={idx} display="flex" justifyContent="space-between">
                        <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                          {PositionMoreHeader[idx]}
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
    </>
  )
}

function ClaimButton({ width, onClick }: { width?: number; onClick: () => void }) {
  return (
    <Button onClick={onClick} fontSize={14} style={{ width: width || 60, borderRadius: 4, height: 36 }}>
      Claim
    </Button>
  )
}

function AccordionButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return <IconButton onClick={onClick}>{expanded ? <AccordionArrowUpIcon /> : <AccordionArrowDownIcon />}</IconButton>
}
