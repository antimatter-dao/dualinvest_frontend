import { useState, useCallback } from 'react'
import { Box, Alert } from '@mui/material'
import VaultCard from 'components/MgmtPage/VaultCard'
import VaultFormComponent from 'components/MgmtPage/VaultForm'
import { useActiveWeb3React } from 'hooks'
import { useDualInvestBalance } from 'hooks/useDualInvest'
import { CURRENCIES } from 'constants/currencies'

const formData = {
  ['Current cycle invested amount:']: '5BTC',
  ['Redeemable:']: '0.23BTC',
  ['P&L:']: '5.23BTC'
}

export default function VaultForm({ currencySymbol, timer }: { currencySymbol: string; timer: number }) {
  const [snackbarOpen, setSnackbarOpen] = useState(true)
  const [isRecurOpen, setIsRecurOpen] = useState(false)

  const { account } = useActiveWeb3React()
  const contractBalance = useDualInvestBalance(CURRENCIES[currencySymbol])

  const handleCloseSnakebar = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  return (
    <Box display="grid" position="relative" gap="35px" mt={-24}>
      {snackbarOpen && (
        <Alert
          onClose={handleCloseSnakebar}
          severity="error"
          sx={{
            width: '100%',
            color: theme => theme.palette.error.main,
            background: theme => theme.palette.error.light,
            border: theme => `1px solid ${theme.palette.error.main}`,
            '& .MuiAlert-icon': {
              color: theme => theme.palette.error.main
            },
            fontSize: 12
          }}
        >
          warning: The primary risk for running this covered call strategy is that the vault may incur a weekly loss in
          the case where the call option sold by the vault expires in-the-money
        </Alert>
      )}

      <VaultCard
        account={account}
        title="BTC Covered Call Vault"
        description="Generates yield by running an automated BTC covered call strategy"
        logoCurSymbol={currencySymbol}
        priceCurSymbol={currencySymbol}
        timer={timer}
        redeemableAmount={formData['Redeemable:']}
        vaultForm={
          <VaultFormComponent
            formData={formData}
            currencySymbol={currencySymbol}
            available={contractBalance}
            apy={'120%'}
          />
        }
        isRecurOpen={isRecurOpen}
        onRecurOpen={() => {
          setIsRecurOpen(prev => !prev)
        }}
        activeOrder={5}
      />
    </Box>
  )
}
