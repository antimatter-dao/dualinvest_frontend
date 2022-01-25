import { useEffect } from 'react'
import { Box } from '@mui/material'
// import antimatterBlackCircle from 'assets/svg/antimatter_circle_black.svg'
// import { Progress, SimpleProgress } from 'components/Progress'
import { usePrice } from 'hooks/usePriceSet'
import ProductTable from './ProductTable'
import { useProductList, useStatistics } from 'hooks/useDualInvestData'
import ProductBanner from 'components/ProductBanner'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import CurrencyTabs from 'components/Tabs/CurrencyTabs'

export default function DualInvest() {
  const productList = useProductList()
  const statistics = useStatistics()
  const BTCPrice = usePrice('BTC')

  useEffect(() => {
    const el = document.getElementById('dualInvestGuide')
    if (!el) return
    const redirect = () => {
      window.open('https://docs.antimatter.finance/antimatter-dual-investment/rules', '_blank')
    }
    el.addEventListener('click', redirect)
    return () => {
      el.removeEventListener('click', redirect)
    }
  })

  return (
    <Box
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <ProductBanner
        title="Dual Investment"
        checkpoints={['Earn fixed yield on idle assets', 'Earn on both ups and downs']}
        val1={
          statistics && BTCPrice
            ? (+statistics.totalBtcDeposit * +BTCPrice + +statistics.totalUsdtDeposit).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : '-'
        }
        subVal1={'Cumulative Deposit Amount'}
        unit1={'USDT'}
        val2={
          statistics
            ? (+statistics.totalInvestAmount).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : '-'
        }
        subVal2={'Cumulative Investment Amount'}
        unit2={'USDT'}
      />
      <Box width={'100%'} sx={{ maxWidth: theme => theme.width.maxContent, margin: '0 24px' }}>
        <CurrencyTabs
          contents={SUPPORTED_CURRENCY_SYMBOL.map(symbol => {
            const list = productList?.[symbol as keyof typeof productList]

            return <ProductTable strikeCurrencySymbol={symbol} productList={list} key={symbol} />
          })}
        />
      </Box>
    </Box>
  )
}
