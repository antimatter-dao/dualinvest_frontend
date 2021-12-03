import { useCallback, useMemo, useState } from 'react'
import { Container, Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card/Card'
import Table from 'components/Table'
import NoDataCard from 'components/Card/NoDataCard'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalCard from 'components/Card/NumericalCard'
import PaginationView from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'
import ActionModal from './ActionModal'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import StatusTag from 'components/Status/StatusTag'

const accountDetailsData = [
  ['Withdraw', 'BTC', '1.087062', 'Sep 21, 2021  10:42:21 AM ', <StatusTag key="status" status="completed" />]
]

export default function Dashboard() {
  const { account } = useActiveWeb3React()
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const theme = useTheme()

  const handleDepositOpen = useCallback(() => {
    setIsDepositOpen(true)
  }, [])

  const handleWithdrawOpen = useCallback(() => {
    setIsWithdrawOpen(true)
  }, [])

  const handleDismiss = useCallback(() => {
    setIsDepositOpen(false)
    setIsWithdrawOpen(false)
  }, [])

  const balanceData = useMemo(
    () => [
      [
        'BTC',
        '0.286952',
        '1.286952',
        '0.286952',
        '0.286952',
        <Box display="flex" key="action" gap={10}>
          <Button fontSize={14} style={{ maxWidth: 92, borderRadius: 4, height: 36 }} onClick={handleDepositOpen}>
            Deposit
          </Button>
          <OutlineButton
            fontSize={14}
            style={{ maxWidth: 92, borderRadius: 4, height: 36, backgroundColor: '#ffffff' }}
            primary
            onClick={handleWithdrawOpen}
          >
            Withdraw
          </OutlineButton>
        </Box>
      ]
    ],
    [handleDepositOpen, handleWithdrawOpen]
  )

  if (!account)
    return (
      <Container sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <>
      <ActionModal isOpen={isDepositOpen} onDismiss={handleDismiss} type="deposit" currencyInput>
        <Box display="flex" mt={-20}>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
            Please make sure there is a certain amount of ETH in the wallet balance, otherwise the deposit will fail due
            to insufficient handling fees.
          </Typography>
        </Box>
      </ActionModal>
      <ActionModal isOpen={isWithdrawOpen} onDismiss={handleDismiss} type="withdraw" />
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
                dayChange="+ 8.91% / $350.28 "
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
                  <Table header={['Type', 'Token', 'Amount', 'Date', 'Status']} rows={accountDetailsData} />
                  <PaginationView count={4} page={1} setPage={() => {}} />
                </>
              ) : (
                <NoDataCard height="20vh" />
              )}
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  )
}
