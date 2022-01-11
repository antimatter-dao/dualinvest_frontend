import { useMemo } from 'react'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Typography, styled, Box, useTheme } from '@mui/material'
import { Subject } from 'components/MgmtPage/stableContent'

const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '18px',
  color: '#808080',
  '& li': {
    marginTop: 10,
    whiteSpace: 'nowrap',
    fontSize: 16
  },
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

export default function RecurringValueMgmt() {
  const theme = useTheme()

  const returnOnInvestment = useMemo(() => {
    return (
      <div>
        <Typography fontSize={16} color={theme.palette.text.primary}>
          Return on investment:
        </Typography>
        <StyledUnorderList>
          <li>Start at 11-29 09:00.</li>
          <li>
            If the BTC price can keep rising within 24 hours, you will receive a reward of up to{' '}
            <span style={{ color: theme.palette.text.primary }}>220.00 USDT</span>.
          </li>
          <li>If the BTC price down in a certain range, it will be eliminated and your total income will be settled</li>
          <li>
            If the first interval down, you will get&nbsp;
            <span style={{ color: theme.palette.text.primary }}>20 USDT</span> compensation
          </li>
        </StyledUnorderList>
      </div>
    )
  }, [theme.palette.text.primary])

  return (
    <MgmtPage
      showFaq={false}
      backLink={routes.recurringVault}
      product={undefined}
      pageTitle={`test`}
      returnOnInvestment={returnOnInvestment}
      subject={Subject.RecurringVault}
      chart={undefined}
      subscribeForm={<Box />}
    />
  )
}
