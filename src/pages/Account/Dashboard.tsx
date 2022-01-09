import { useCallback, useMemo, useState } from 'react'
import { Container, Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import Table from 'components/Table'
import NoDataCard from 'components/Card/NoDataCard'
import Pagination from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'
import StatusTag from 'components/Status/StatusTag'
import TransactionTypeIcon from 'components/Icon/TransactionTypeIcon'
import { Token } from 'constants/token'
import useBreakpoint from 'hooks/useBreakpoint'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as UpperRightIcon } from 'assets/componentsIcon/upper_right_icon.svg'
import { useAccountRecord } from 'hooks/useDualInvestData'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils/index'
import { toChecksumAddress } from 'web3-utils'

const RecordType: { [key in number]: 'withdraw' | 'deposit' } = {
  1: 'deposit',
  2: 'withdraw'
}

const DetailTableHeader = ['Type', 'Token', 'Amount', 'Date']

export default function Dashboard() {
  const { account, chainId } = useActiveWeb3React()
  const isDownMd = useBreakpoint('md')
  const [page, setPage] = useState(1)
  const { accountRecord, pageParams } = useAccountRecord(page)

  const accountDetailsData = useMemo(() => {
    const records = accountRecord?.records
    if (!records) return []

    return records.map(record => {
      const scanLink = chainId ? getEtherscanLink(chainId, record.hash, 'transaction') : ''
      const token = chainId ? new Token(chainId, toChecksumAddress(record.currency), 18, record.symbol) : undefined

      return [
        <TransactionTypeIcon key="type" txType={RecordType[record.type]} />,
        <Box key={1} display="flex" gap={10} alignItems="center">
          <CurrencyLogo currency={token} size="16px" />
          {record.symbol}
        </Box>,
        <Box key={1} display="flex" alignItems="center">
          <ExternalLink
            href={scanLink}
            sx={{
              display: 'flex',
              color: theme => theme.palette.text.primary,
              '&:hover': {
                color: theme => theme.palette.primary.main
              }
            }}
          >
            <Typography component="span" sx={{}}>
              {record.amount}
            </Typography>
            <Box component="span" sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
              <UpperRightIcon style={{ color: 'currentColor' }} />
            </Box>
          </ExternalLink>
        </Box>,
        dayjs(new Date(+record.timestamp * 1000).toUTCString()).format('MMM DD, YYYY hh:mm:ss A') + ' UTC',
        <>{!isDownMd && <StatusTag key="status" status="completed" />}</>
      ]
    })
  }, [accountRecord?.records, chainId, isDownMd])

  const handlePage = useCallback((event, value) => setPage(value), [])

  if (!account)
    return (
      <Container disableGutters sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <>
      <Container disableGutters sx={{ mt: 48 }}>
        <Box display="grid" gap={48}>
          <Card>
            <Box padding="38px 24px" display="grid" gap={36}>
              <Typography fontSize={24} fontWeight={700}>
                Account Details
              </Typography>
              <Box position="relative">
                {!accountRecord && (
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

                {accountDetailsData.length > 0 ? (
                  <>
                    {isDownMd ? (
                      <AccountDetailCards data={accountDetailsData} />
                    ) : (
                      <Table header={DetailTableHeader} rows={accountDetailsData} />
                    )}

                    <Pagination
                      count={pageParams?.count}
                      page={page}
                      perPage={pageParams?.perPage}
                      boundaryCount={0}
                      total={pageParams.total}
                      onChange={handlePage}
                    />
                  </>
                ) : (
                  <NoDataCard height="20vh" />
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  )
}

function AccountDetailCards({ data }: { data: any[][] }) {
  return (
    <Box display="flex" flexDirection="column" gap={8} mb={24}>
      {data.map((dataRow, idx) => (
        <Card color="#F2F5FA" padding="17px 16px" key={`detail-row-${idx}`}>
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx2) => {
              return (
                <Box key={`detail-row-${idx}-datum-${idx2}`} display="flex" justifyContent="space-between">
                  <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }} component="div">
                    {DetailTableHeader[idx2]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600} component="div">
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>
          <Box
            borderRadius={22}
            bgcolor="rgba(17, 191, 45, 0.16)"
            width="100%"
            height={36}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={20}
          >
            <Typography fontSize={14} color="#11BF2D" textAlign="center">
              Completed
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  )
}
