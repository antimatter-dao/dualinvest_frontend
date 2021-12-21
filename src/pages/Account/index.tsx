import { Box, Typography } from '@mui/material'
import Tabs from 'components/Tabs/Tabs'
import Image from 'components/Image'
import Dashboard from './Dashboard'
import Position from './Position'
import History from './History'
import Referral from './Referral'
import dashboardUrl from 'assets/images/dashboard.png'
import positionUrl from 'assets/images/position.png'
import historyUrl from 'assets/images/history.png'
import referralUrl from 'assets/images/referral.png'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Account() {
  return (
    <Box
      sx={{
        maxWidth: theme => theme.width.maxContent,
        margin: { xs: '0 0 auto', md: '62px 0 auto' },
        width: '100%',
        padding: { xs: 20, md: 0 }
      }}
    >
      <Tabs
        titles={[
          <Tab text="Dashboard" iconUrl={dashboardUrl} key="dashboard" />,
          <Tab text="Position" iconUrl={positionUrl} key="position" />,
          <Tab text="Referral" iconUrl={referralUrl} key="referral" />,
          <Tab text="History" iconUrl={historyUrl} key="history" />
        ]}
        contents={[
          <Dashboard key="dashboard" />,
          <Position key="position" />,
          <Referral key="referral" />,
          <History key="history" />
        ]}
      />
    </Box>
  )
}

function Tab({ text, iconUrl }: { text: string; iconUrl: string }) {
  const isDownMd = useBreakpoint('md')
  return (
    <Typography
      key="dashboard"
      fontWeight={500}
      sx={{ display: 'flex', alignItems: 'center', gap: { xs: 8.45, md: 12 } }}
    >
      {isDownMd ? (
        <Image src={iconUrl} style={{ width: 17, height: 'auto' }} />
      ) : (
        <Image src={iconUrl} style={{ width: 24, height: 'auto' }} />
      )}

      {text}
    </Typography>
  )
}
