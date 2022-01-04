import { useEffect } from 'react'
import { Box, Typography, styled, Grid } from '@mui/material'
import { ReactComponent as DualInvestGuide } from 'assets/svg/dualInvestGuide.svg'
import checkUrl from 'assets/images/check.png'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import NumericalCard from 'components/Card/NumericalCard'
// import antimatterBlackCircle from 'assets/svg/antimatter_circle_black.svg'
// import { Progress, SimpleProgress } from 'components/Progress'
import useBreakpoint from 'hooks/useBreakpoint'
import { usePrice } from 'hooks/usePriceSet'
import { trimNumberString } from 'utils/trimNumberString'
import { useBindModal } from 'hooks/useReferralModal'
import ProductTable from './ProductTable'
import { useProductList, useStatistics } from 'hooks/useDualInvestData'

const StyledDualInvestGuide = styled(DualInvestGuide)(({ theme }) => ({
  marginBottom: 13,
  '& #dualInvestGuide': {
    zIndex: 2,
    '&:hover, :focus, :active': {
      opacity: 1,
      cursor: 'pointer'
    }
  },
  flexShrink: 1,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100vw - 80px)',
    margin: '0 auto'
  }
}))

export default function DualInvest() {
  const isDownMd = useBreakpoint('md')
  const productList = useProductList()
  const statistics = useStatistics()
  const BTCPrice = usePrice('BTC')
  useBindModal()

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
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          width: '100%',
          background: theme => theme.palette.background.paper,
          padding: { xs: '20px', md: '40px', lg: '44px 61px' }
        }}
      >
        <Box
          sx={{ maxWidth: theme => ({ xs: 'calc(100vw - 88px)', md: theme.width.maxContent }) }}
          width="100%"
          display={{ xs: 'grid', sm: 'flex' }}
          justifyContent={{ sm: 'center', md: 'space-between' }}
          alignItems="center"
        >
          <Box display="grid" gap={12}>
            <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
              Dual Investment
            </Typography>
            <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 8, md: 32 }} paddingBottom={{ xs: 16, md: 30 }}>
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Earn fixed yield on idle assets
                  </Typography>
                }
              />
              <LogoText
                logo={<Image src={checkUrl} />}
                text={
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, opacity: 0.8 }}>
                    Earn on both ups and downs
                  </Typography>
                }
              />
            </Box>
            <Grid container spacing={{ xs: 8, md: 20 }}>
              <Grid item xs={12} md={6}>
                <NumericalCard
                  width={isDownMd ? '320px' : '264px'}
                  value={
                    statistics && BTCPrice
                      ? trimNumberString(
                          (+statistics.totalBtcDeposit * +BTCPrice + +statistics.totalUsdtDeposit).toLocaleString(),
                          0
                        )
                      : '-'
                  }
                  unit="USDT"
                  border
                  subValue="Cumulative Deposit Amount"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumericalCard
                  width={isDownMd ? '320px' : '264px'}
                  value={statistics ? trimNumberString((+statistics.totalInvestAmount).toLocaleString(), 0) : '-'}
                  unit="USDT"
                  border
                  subValue="Cumulative Investment Amount"
                />
              </Grid>
            </Grid>
          </Box>
          <StyledDualInvestGuide />
        </Box>
      </Box>
      <ProductTable strikeCurrencySymbol="BTC" productList={productList} />
    </Box>
  )
}

// function CastValue({ unit, val, total }: { unit: string; val: number; total: number }) {
//   const isDownMd = useBreakpoint('md')
//   const percentage = ((val / total) * 100).toFixed(2)

//   if (isDownMd) {
//     return (
//       <RowStr>
//         {percentage}% {val} {unit} / {total} {unit}
//       </RowStr>
//     )
//   }
//   return <Progress unit={unit} val={val} total={total} />
// }
