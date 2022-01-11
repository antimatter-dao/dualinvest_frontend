import { Box, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import BlueRing from 'components/Icon/BlueRing'
import { CURRENCIES } from 'constants/currencies'
import useBreakpoint from 'hooks/useBreakpoint'
import { usePrice } from 'hooks/usePriceSet'

export default function VaultCard({
  logoCurSymbol,
  priceCurSymbol,
  title,
  description,
  apy,
  deposit,
  onClick
}: {
  logoCurSymbol: string
  priceCurSymbol: string
  title: string
  description: string
  apy: string
  deposit: string
  onClick: () => void
}) {
  const isDownSm = useBreakpoint()
  const isDownMd = useBreakpoint()
  const curPrice = usePrice(priceCurSymbol)

  return (
    <Box
      component="button"
      onClick={onClick}
      display="grid"
      width="100%"
      gap={32}
      margin={{ xs: '0px 20px' }}
      sx={{
        border: '1px solid transparent',
        background: theme => theme.palette.background.paper,
        borderRadius: 2,
        padding: '34px 24px',
        maxWidth: theme => ({ xs: `calc(100% - 40px)`, md: theme.width.maxContent }),
        '&:hover': {
          cursor: 'pointer',
          borderColor: theme => theme.palette.primary.light
        }
      }}
    >
      <Box
        display={{ xs: 'grid', sm: 'flex' }}
        alignContent="center"
        justifyContent={{ xs: 'stretch', sm: 'space-between' }}
        gap={{ xs: '0', sm: '40px' }}
      >
        <Box display="flex" columnGap={20} alignItems={'center'}>
          <CurrencyLogo
            currency={CURRENCIES[logoCurSymbol]}
            size="53px"
            style={{
              gridRowStart: 1,
              gridRowEnd: isDownSm ? 'span 1' : 'span 2',
              marginBottom: isDownSm ? 12 : 0
            }}
          />
          <Typography
            fontWeight={700}
            sx={{
              gridColumnStart: isDownSm ? 1 : 2,
              gridColumnEnd: 'span 1',
              fontSize: 24
            }}
          >
            {title}
          </Typography>
        </Box>
        <Card gray={isDownSm} style={{ borderRadius: '16px', margin: isDownMd ? '16px 0' : 0 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems={isDownMd ? 'flex-start' : 'flex-end'}
            padding={{ xs: '16px', sm: '16px 0' }}
            gap={isDownMd ? 10 : 0}
          >
            <Typography color="primary" fontSize={24} fontWeight={700} gap={8} display="flex" alignItems="center">
              <span style={{ width: 120 }}>
                {' '}
                {curPrice
                  ? (+curPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '-'}
              </span>
              <BlueRing />
            </Typography>
            <Typography fontSize={16} sx={{ color: theme => theme.palette.text.secondary }}>
              {priceCurSymbol} latest spot price
            </Typography>
          </Box>
        </Card>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} gap={24} padding="0 50px">
        <Typography
          fontSize={16}
          fontWeight={700}
          sx={{ color: theme => theme.palette.text.secondary, width: '100%', display: 'flex', alignItems: 'center' }}
        >
          {description}
        </Typography>
        <NumericalCard value={apy} subValue="Current Projected Yield(APY)" border />
        <NumericalCard value={deposit} subValue="Your Deposit" border />
      </Box>
    </Box>
  )
}
