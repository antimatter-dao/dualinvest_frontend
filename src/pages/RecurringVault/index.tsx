import { Box } from '@mui/material'
import ProductBanner from 'components/ProductBanner'

export default function RecurringVault() {
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
    </Box>
  )
}
