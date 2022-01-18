import { useHistory } from 'react-router-dom'
import { Box } from '@mui/material'
import ProductBanner from 'components/ProductBanner'
import VaultCard from './VaultProductCard'
import { routes } from 'constants/routes'

export default function RecurringVault() {
  const history = useHistory()

  return (
    <Box
      id="recurring_values"
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <ProductBanner
        title="Recurring Vault"
        checkpoints={['Automated strategy for yield generation']}
        val1={'$ 57,640'}
        val2={'$ 114,375'}
        unit1={''}
        unit2={''}
        subVal1={'Total BTC Subscribed'}
        subVal2={'Total USDT Subscribed'}
      />
      <VaultCard
        logoCurSymbol="BTC"
        priceCurSymbol="BTC"
        title="BTC Covered Call Vault"
        description="Generates yield by running an automated BTC covered call strategy"
        apy="132%"
        deposit="13.2 BTC"
        bgColor="linear-gradient(90deg, #F6D365 0%, #FDA085 100%)"
        onClick={() => {
          history.push(routes.recurringVaultMgmt)
        }}
      />
      <VaultCard
        logoCurSymbol="USDT"
        priceCurSymbol="BTC"
        title="BTC Put Selling Vault"
        description="Generates yield by running an automated put selling strategy"
        apy="132%"
        deposit="132,567 USDT"
        bgColor="linear-gradient(266.8deg, #5BB053 0.46%, #88CA7B 99.78%)"
        onClick={() => {
          history.push(routes.recurringVaultMgmt)
        }}
      />
    </Box>
  )
}
