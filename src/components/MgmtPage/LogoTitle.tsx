import { Box, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import useBreakpoint from 'hooks/useBreakpoint'

export function LogoTitle({
  logoCurSymbol,
  title,
  description
}: {
  logoCurSymbol: string
  title: string | JSX.Element
  description: string
}) {
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

  return (
    <Box display="grid" columnGap={20} mb={{ xs: 10, md: 0 }} width="auto" zIndex={2} maxWidth="max-content">
      {logoCurSymbol && (
        <CurrencyLogo
          currency={SUPPORTED_CURRENCIES[logoCurSymbol]}
          size={isDownMd ? '32px' : '64px'}
          style={{
            gridRowStart: 1,
            gridRowEnd: isDownSm ? 'span 1' : 'span 2',
            marginBottom: isDownSm ? 12 : 0
          }}
        />
      )}

      <Typography
        fontWeight={700}
        align="left"
        sx={{
          gridColumnStart: isDownSm ? 1 : 2,
          gridColumnEnd: 'span 1',
          fontSize: {
            xs: 20,
            md: 24
          }
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography fontSize={{ xs: 14, md: 16 }} sx={{ opacity: 0.5 }} align="left" mt={{ xs: 8, md: 0 }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}
