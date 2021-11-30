import { Container, Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import Table from 'components/Table'
import NoDataCard from 'components/Card/NoDataCard'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalCard from 'components/Card/NumericalCard'
import PaginationView from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'

const balanceData = [
  [
    'BTC',
    '0.286952',
    '1.286952',
    '0.286952',
    '0.286952',
    <Box display="flex" key="action" gap={10}>
      <Button fontSize={14} style={{ maxWidth: 92, borderRadius: 4, height: 36 }}>
        Deposit
      </Button>
      <Button fontSize={14} style={{ maxWidth: 92, borderRadius: 4, height: 36 }}>
        Withdraw
      </Button>
      <OutlineButton
        fontSize={14}
        style={{ maxWidth: 92, borderRadius: 4, height: 36, backgroundColor: '#ffffff' }}
        primary
      >
        Swap
      </OutlineButton>
    </Box>
  ]
]

const accountDetailsData = [['Withdraw', 'BTC', '1.087062', 'Sep 21, 2021  10:42:21 AM ']]

export default function Dashboard() {
  const { account } = useActiveWeb3React()

  if (!account)
    return (
      <Container sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <Container sx={{ mt: 48 }}>
      <Box display="grid" gap={48}>
        <Card>
          <Box padding="38px 24px" display="grid" gap={36}>
            <Box>
              <Typography fontSize={24} fontWeight={700}>
                My Account Balance
              </Typography>
              <Typography sx={{ color: theme => theme.palette.text.secondary, mt: 8 }}>
                Deposit funds to your Dual Investment account, you can withdraw available amount at any time
              </Typography>
            </Box>
            <NumericalCard
              value={'1,908.12'}
              border
              title="Portfolio Value"
              unit="$"
              padding="20px 24px"
              fontSize={'44px'}
            >
              <Button
                style={{ position: 'absolute', right: '24px', bottom: '20px', height: 44, fontSize: 14 }}
                width="148px"
              >
                Invest
              </Button>
            </NumericalCard>
            {balanceData ? (
              <Table header={['Token', 'Available', 'Amount', 'Cumulative Invest', 'PnL', '']} rows={balanceData} />
            ) : (
              <NoDataCard height="20vh" />
            )}
          </Box>
        </Card>

        <Card>
          <Box padding="38px 24px" display="grid" gap={36}>
            <Typography fontSize={24} fontWeight={700}>
              Account Details
            </Typography>
            {accountDetailsData ? (
              <>
                <Table header={['Type', 'Token', 'Amount', 'Date', '']} rows={accountDetailsData} />
                <PaginationView count={4} page={1} setPage={() => {}} />
              </>
            ) : (
              <NoDataCard height="20vh" />
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  )
}
